import { Request } from "express";
import mongoose from "mongoose";
import Review from "../../models/Review.js";
import Product from "../../models/Product.js";

// Helper function to recalculate and update a product's ratingAverage and totalReviews
const updateProductRating = async (productId: string) => {
    try {
        // Only average reviews that actually have a rating
        const stats = await Review.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(productId),
                    rating: { $exists: true, $ne: null },
                },
            },
            {
                $group: {
                    _id: "$productId",
                    ratingAverage: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                ratingAverage: Math.round(stats[0].ratingAverage * 10) / 10,
                totalReviews: stats[0].totalReviews,
            });
        } else {
            await Product.findByIdAndUpdate(productId, {
                ratingAverage: 0,
                totalReviews: 0,
            });
        }
    } catch (err) {
        console.error(`Failed to update product rating for ${productId}:`, err);
    }
};

export const indexReviewsService = async (req: Request) => {
    const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
    const filter = productId ? { productId } : {};

    return await Review.find(filter)
        .populate("userId", "name image")
        .populate("productId")
        .sort({ createdAt: -1 });
};

// Check if user already has a rating for this product
export const checkUserRatingService = async (req: Request) => {
    const userId = req.user?.id || req.user?._id;
    const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;

    if (!userId || !productId) {
        return { hasRated: false, existingRating: null };
    }

    const existingRating = await Review.findOne({
        userId,
        productId,
        rating: { $exists: true, $ne: null },
    });

    return {
        hasRated: !!existingRating,
        existingRating: existingRating ? existingRating.rating : null,
    };
};

export const createReviewService = async (req: Request) => {
    const userId = req.user?.id || req.user?._id;
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        const error: any = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    // Check if the user is a vendor and owns the product
    const { default: Vendor } = await import("../../models/Vendor.js");
    const vendor = await Vendor.findOne({ userId });
    if (vendor && product.vendorId.toString() === vendor._id.toString()) {
        const error: any = new Error("You cannot review your own product");
        error.statusCode = 400;
        throw error;
    }

    // If user is submitting a rating, check if they already rated this product
    if (rating != null) {
        const existingRating = await Review.findOne({
            userId,
            productId,
            rating: { $exists: true, $ne: null },
        });

        if (existingRating) {
            const error: any = new Error("You have already rated this product. You can only add comments now.");
            error.statusCode = 400;
            throw error;
        }
    }

    // Create the review/comment
    const review = await Review.create({
        userId,
        productId,
        ...(rating != null ? { rating } : {}),
        ...(comment ? { comment } : {}),
    });

    // Recalculate average rating for the product
    await updateProductRating(review.productId.toString());

    return await Review.findById(review._id)
        .populate("userId", "name image")
        .populate("productId");
};

export const updateReviewService = async (req: Request) => {
    const userId = req.user?.id || req.user?._id;
    const review = await Review.findById(req.params.id);

    if (!review) {
        const error: any = new Error("Review not found");
        error.statusCode = 404;
        throw error;
    }

    if (review.userId.toString() !== userId?.toString()) {
        const error: any = new Error("Unauthorized: You do not own this review");
        error.statusCode = 403;
        throw error;
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    });

    if (updatedReview) {
        // Recalculate average rating for the product
        await updateProductRating(updatedReview.productId.toString());
    }

    return await Review.findById(updatedReview?._id)
        .populate("userId", "name image")
        .populate("productId");
};

export const deleteReviewService = async (req: Request) => {
    const userId = req.user?.id || req.user?._id;
    const review = await Review.findById(req.params.id);
    if (!review) return null;

    if (review.userId.toString() !== userId?.toString()) {
        const error: any = new Error("Unauthorized: You do not own this review");
        error.statusCode = 403;
        throw error;
    }

    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating for the product
    await updateProductRating(review.productId.toString());

    return deletedReview;
};