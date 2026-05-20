import { Request } from "express";
import Review from "../../models/Review.js";

export const indexReviewsService = async (req: Request) => {
    return await Review.find()
        .populate("userId")
        .populate("productId");
};

export const createReviewService = async (req: Request) => {
    return await Review.create({
        ...req.body,
        userId: req.user?.id,
    });
};

export const updateReviewService = async (req: Request) => {
    return await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );
};

export const deleteReviewService = async (req: Request) => {
    return await Review.findByIdAndDelete(req.params.id);
};