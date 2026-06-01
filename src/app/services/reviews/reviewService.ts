import { Request } from "express";
import Review from "../../models/Review.js";

export const indexReviewsService = async (req: Request) => {
    return await Review.find()
        .populate("userId")
        .populate("productId");
};

export const createReviewService = async (req: Request) => {
    const review = await Review.create({
        ...req.body,
        userId: req.user?.id,
    });

    // إرجاع المراجعة كاملة مع بيانات المستخدم والمنتج فور الإنشاء
    return await Review.findById(review._id)
        .populate("userId")
        .populate("productId");
};

export const updateReviewService = async (req: Request) => {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    });

    return await Review.findById(updatedReview?._id)
        .populate("userId")
        .populate("productId");
};

export const deleteReviewService = async (req: Request) => {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    return deletedReview;
};