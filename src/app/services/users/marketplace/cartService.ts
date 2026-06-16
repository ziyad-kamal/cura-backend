/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import Cart from "../../../models/Cart.js";
import Product from "../../../models/Product.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";

export const getCartService = async (req: Request) => {
    const userId = req.user?._id;

    if (!userId) {
        return null;
    }
    const cart = await Cart.findOne({ userId })
        .populate({
            path: "items.productId",
            select: "title name price images image category vendorId",
        })
        .lean();

    if (cart) {
        (cart.items as any) = await Promise.all(
            cart.items.map(async (item: any) => ({
                ...item,
                productId: {
                    ...item.productId,
                    images: await resolveFiles(item.productId.images || [], "public"),
                },
            })),
        );
    }

    return cart ?? { items: [], totalPrice: 0, _id: null };
};

export const addToCartService = async (req: Request) => {
    const { productId, quantity, userId } = req.body; // Remove price from destructuring

    const finalUserId = userId || req.user?._id;

    if (!finalUserId) {
        throw new Error("User ID required");
    }

    // Fetch product details to get the authoritative price and vendorId
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    const price =
        product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
            ? product.discountPrice
            : product.price;
    const { vendorId } = product;

    let cart = await Cart.findOne({ userId: finalUserId });

    if (!cart) {
        cart = await Cart.create({
            userId: finalUserId,
            items: [{ productId, vendorId, quantity, price }],
            totalPrice: quantity * price,
        });
        await cart.populate({
            path: "items.productId",
            select: "title name price images image category vendorId",
        });
    } else {
        const itemIndex = cart.items.findIndex((item) => item.productId?.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, vendorId, quantity, price });
        }

        // Recalculate total price based on current items and their prices from DB (if needed)
        // For simplicity, we'll assume item.price in cart is updated if product price changes.
        // A more robust solution might re-fetch all product prices here.
        cart.totalPrice = cart.items.reduce((total, item) => {
            // Ensure item.price is used, or re-fetch if product price can change frequently
            return total + item.quantity * item.price;
        }, 0);
    }
    await cart.save();

    // Always return a fully populated cart
    return await Cart.findOne({ userId: finalUserId }).populate({
        path: "items.productId",
        select: "title name price images image category vendorId", // Select necessary fields for frontend
    });
};

export const removeFromCartService = async (req: Request) => {
    return await Cart.findOneAndUpdate(
        {
            userId: req.user?._id,
        },
        {
            $pull: {
                items: {
                    _id: req.params.id,
                },
            },
        },
        {
            new: true,
            // Ensure the returned document is populated
            populate: {
                path: "items.productId",
                select: "title name price images image category vendorId",
            },
        },
    );
};

export const clearCartService = async (req: Request) => {
    return await Cart.findOneAndUpdate(
        {
            userId: req.user?._id,
        },
        {
            items: [],
            totalPrice: 0,
        },
        {
            new: true, // Return the modified document
            // No need for populate as items array is empty
        },
    );
};

export const syncCartService = async (req: Request) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new Error("User ID required");
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
        throw new Error("Items must be an array");
    }

    if (items.length === 0) {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
        }
        return cart ?? { items: [], totalPrice: 0, _id: null };
    }

    // Extract product IDs
    const productIds = items.map((item) => item.productId);

    // Fetch all products from DB to get verified price and vendorId
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const cartItems = [];
    let totalPrice = 0;

    for (const item of items) {
        const prodIdStr = item.productId?.toString();
        if (!prodIdStr) continue;

        const product = productMap.get(prodIdStr);
        if (!product) {
            continue; // Skip products not found in database
        }

        const qty = Math.max(1, parseInt(item.quantity) || 1);
        const price =
            product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
                ? product.discountPrice
                : product.price;
        const vendorId = product.vendorId;

        cartItems.push({
            productId: product._id,
            vendorId,
            quantity: qty,
            price,
        });

        totalPrice += qty * price;
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        await Cart.create({
            userId,
            items: cartItems,
            totalPrice,
        });
    } else {
        cart.items = cartItems as any;
        cart.totalPrice = totalPrice;
        await cart.save();
    }

    return await Cart.findOne({ userId }).populate({
        path: "items.productId",
        select: "title name price images image category vendorId",
    });
};
