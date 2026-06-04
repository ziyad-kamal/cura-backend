import { Request } from "express";
import Product from "../../models/Product.js";
import Vendor from "../../models/Vendor.js";
import NotFoundError from "../../errors/NotFoundError.js";

export const indexProductsService = async (req: Request) => {
    return await Product.find()
        .populate("vendorId")
        .populate("categoryId");
};

export const createProductService = async (req: Request) => {
    const userId = req.user?._id;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new NotFoundError("Vendor profile not found. Please register as a vendor first.");
    }

    const productData = {
        ...req.body,
        vendorId: vendor._id
    };

    const product = await Product.create(productData);
    
    return await Product.findById(product._id)
        .populate("vendorId")
        .populate("categoryId");
};

export const showProductService = async (req: Request) => {
    const populated = await Product.findById(req.params.id)
        .populate("vendorId")
        .populate("categoryId");

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

    return await Product.findById(updatedProduct?._id)
        .populate("vendorId")
        .populate("categoryId");
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