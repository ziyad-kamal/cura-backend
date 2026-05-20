import { Request } from "express";
import Product from "../../models/Product.js";

export const indexProductsService = async (req: Request) => {
    return await Product.find()
        .populate("vendorId")
        .populate("categoryId");
};

export const createProductService = async (req: Request) => {
    return await Product.create(req.body);
};

export const showProductService = async (req: Request) => {
    return await Product.findById(req.params.id)
        .populate("vendorId")
        .populate("categoryId");
};

export const updateProductService = async (req: Request) => {
    return await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );
};

export const deleteProductService = async (req: Request) => {
    return await Product.findByIdAndDelete(req.params.id);
};