import { Request } from "express";
import { ProductInterface } from "../../../../interfaces/models/ProductInterface.js";
import NotFoundError from "../../../errors/NotFoundError.js";
import Product from "../../../models/Product.js";
import Vendor from "../../../models/Vendor.js";
import { handleS3Files } from "../../../utils/handleS3Files.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";

export const indexProductsService = async (req: Request) => {
    const products = await Product.find().populate("vendorId").populate("categoryId").lean();

    return Promise.all(
        products.map(async (product) => ({
            ...product,
            images: await resolveFiles(product.images, "public"),
        })),
    );
};

export const createProductService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found. Please register as a vendor first.");
    }

    let updatedFiles = await handleS3Files(req.body.images, "public/products/");

    const productData = {
        ...req.body,
        vendorId: vendor._id,
    };

    const product = await Product.create(productData);

    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, "public");
        return { ...product, files: resolvedFiles } as ProductInterface;
    }

    return await Product.findById(product._id).populate("vendorId").populate("categoryId");
};

export const showProductService = async (req: Request) => {
    const populated = await Product.findById(req.params.id).populate("vendorId").populate("categoryId");

    return populated;
};

export const updateProductService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found.");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new NotFoundError("Product not found");
    }

    if (product.vendorId.toString() !== vendor._id.toString()) {
        throw new Error("Unauthorized: You do not own this product");
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    });

    return await Product.findById(updatedProduct?._id).populate("vendorId").populate("categoryId");
};

export const deleteProductService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found.");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new NotFoundError("Product not found");
    }

    if (product.vendorId.toString() !== vendor._id.toString()) {
        throw new Error("Unauthorized: You do not own this product");
    }

    return await Product.findByIdAndDelete(req.params.id);
};
