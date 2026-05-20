import { Request } from "express";
import Category from "../../models/Category.js";

export const indexCategoriesService = async (req: Request) => {
    return await Category.find();
};

export const createCategoryService = async (req: Request) => {
    return await Category.create(req.body);
};

export const showCategoryService = async (req: Request) => {
    return await Category.findById(req.params.id);
};

export const updateCategoryService = async (req: Request) => {
    return await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );
};

export const deleteCategoryService = async (req: Request) => {
    return await Category.findByIdAndDelete(req.params.id);
};