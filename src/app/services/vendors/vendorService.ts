import { Request } from "express";
import Vendor from "../../models/Vendor.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import OrderItem from "../../models/OrderItem.js";
import { UserRoles } from "../../../enums/UserRoles.js";
import NotFoundError from "../../errors/NotFoundError.js";
import RecordExistError from "../../errors/RecordExistError.js";
import { resolveFiles } from "../../utils/resolveFiles.js";

const generateUniqueSlug = async (storeName: string): Promise<string> => {
    let slug = storeName
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/(^-|-$)+/g, "");

    if (!slug) {
        slug = "store-" + Math.random().toString(36).substring(2, 9);
    }

    let slugExists = await Vendor.findOne({ storeSlug: slug });
    if (!slugExists) {
        return slug;
    }

    let count = 1;
    while (true) {
        const testSlug = `${slug}-${count}`;
        slugExists = await Vendor.findOne({ storeSlug: testSlug });
        if (!slugExists) {
            return testSlug;
        }
        count++;
    }
};

export const indexVendorsService = async (req: Request) => {
    return await Vendor.find({ isActive: true });
};

export const createVendorService = async (req: Request) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
        throw new RecordExistError("User is already registered as a vendor");
    }

    const { storeName, description, logo, banner, bankAccount, socialLinks } = req.body;
    if (!storeName) {
        throw new Error("Store name is required");
    }

    const storeSlug = await generateUniqueSlug(storeName);

    const vendor = await Vendor.create({
        userId,
        storeName,
        storeSlug,
        description,
        logo,
        banner,
        bankAccount,
        socialLinks,
    });

    await User.findByIdAndUpdate(userId, { role: UserRoles.VENDOR });

    return vendor;
};

export const showVendorService = async (req: Request) => {
    return await Vendor.findById(req.params.id);
};

export const getVendorByUserIdService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }
    return vendor;
};

export const updateVendorService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }

    const updates = { ...req.body };
    if (updates.storeName && updates.storeName !== vendor.storeName) {
        updates.storeSlug = await generateUniqueSlug(updates.storeName);
    } else {
        delete updates.storeSlug;
    }
    delete updates.userId;

    return await Vendor.findByIdAndUpdate(vendor._id, updates, {
        returnDocument: "after",
        runValidators: true,
    });
};

export const deleteVendorService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }
    await Vendor.findByIdAndDelete(vendor._id);
    await User.findByIdAndUpdate(userId, { role: UserRoles.USER });
};

export const getVendorDashboardStatsService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }

    const vendorId = vendor._id;

    const totalProducts = await Product.countDocuments({ vendorId });

    const orderItems = await OrderItem.find({ vendorId });

    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    const orderIds = new Set<string>();

    for (const item of orderItems) {
        if (item.status !== "cancelled") {
            totalRevenue += item.quantity * item.price;
        }
        if (item.status === "pending") {
            pendingOrdersCount++;
        }
        orderIds.add(item.orderId.toString());
    }

    const totalOrders = orderIds.size;

    return {
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrdersCount,
    };
};

export const getVendorProductsService = async (req: Request) => {
    const userId = req.user?._id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }

    const products = await Product.find({ vendorId: vendor._id }).populate("categoryId").lean();

    const productsWithImages = await Promise.all(
        products.map(async (product) => ({
            ...product,
            images: await resolveFiles(product.images || [], "public"),
        })),
    );

    return productsWithImages;
};

export const getVendorOrdersService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }
    return await OrderItem.find({ vendorId: vendor._id })
        .populate("orderId")
        .populate("productId")
        .sort({ createdAt: -1 });
};

export const updateVendorOrderItemStatusService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found");
    }

    const { orderId, itemId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new Error("Status is required");
    }

    const allowedStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
        throw new Error(`Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`);
    }

    const orderItem = await OrderItem.findOne({
        _id: itemId,
        orderId,
        vendorId: vendor._id,
    });

    if (!orderItem) {
        throw new NotFoundError("Order item not found for this vendor");
    }

    orderItem.status = status;
    await orderItem.save();

    const allItems = await OrderItem.find({ orderId });

    let newOrderStatus = "confirmed";
    const statuses = allItems.map((item) => item.status);

    if (statuses.every((s) => s === "delivered")) {
        newOrderStatus = "delivered";
    } else if (statuses.every((s) => s === "cancelled")) {
        newOrderStatus = "cancelled";
    } else if (statuses.some((s) => s === "shipped") && !statuses.some((s) => s === "pending" || s === "confirmed")) {
        newOrderStatus = "shipped";
    } else if (statuses.some((s) => s === "confirmed") && !statuses.some((s) => s === "pending")) {
        newOrderStatus = "confirmed";
    } else if (statuses.some((s) => s === "pending")) {
        newOrderStatus = "pending";
    }

    await Order.findByIdAndUpdate(orderId, { orderStatus: newOrderStatus });

    return orderItem;
};
