import { Request, Response } from "express";
import Product from "../../models/Product.js";
import {
    createProductService,
    deleteProductService,
    showProductService,
    updateProductService,
} from "../../services/products/productService.js";

export const index = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, category, minPrice, maxPrice } = req.query;

        const query: any = {};

        // filtration based on search
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // filtration based on category
        if (category) {
            query.categoryId = category;
        }

        // filtration based on price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query)
            .populate("categoryId")
            .populate("vendorId")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / Number(limit));

        res.status(200).json({
            data: products,
            pagination: {
                total,
                page: Number(page),
                pages: totalPages,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: "Error" });
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const product = await showProductService(req);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        return res.status(500).json({ 
            message: error?.message ?? "no message",
            name: error?.name ?? "no name",
            str: String(error)
        });
    }
};

export const store = async (req: Request, res: Response) => {
    try {
        const product = await createProductService(req);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ message: "Error" });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const product = await updateProductService(req);
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ message: "Error" });
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        await deleteProductService(req);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: "Error" });
    }
};