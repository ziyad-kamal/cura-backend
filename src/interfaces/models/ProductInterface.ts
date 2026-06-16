import mongoose from "mongoose";

export interface ProductInterface {
    _id?: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: { s3Key: string; type?: string }[];
    categoryId?: mongoose.Types.ObjectId;
    brand?: string;
    ratingAverage: number;
    totalReviews: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}