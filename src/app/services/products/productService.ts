import { Request } from "express";
import Product from "../../models/Product.js";

export const indexProductsService = async (req: Request) => {
    return await Product.find()
        .populate("vendorId")
        .populate("categoryId");
};

export const createProductService = async (req: Request) => {
    const product = await Product.create(req.body);
    
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
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    });
    // Return the updated product fully populated
    return await Product.findById(updatedProduct?._id)
        .populate("vendorId")
        .populate("categoryId")
    // .populate("reviews");
};

export const deleteProductService = async (req: Request) => {
    return await Product.findByIdAndDelete(req.params.id);
};