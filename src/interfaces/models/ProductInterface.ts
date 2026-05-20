import mongoose from "mongoose";

export interface ProductInterface {
    vendorId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    categoryId?: mongoose.Types.ObjectId;
    brand?: string;
    ratingAverage: number;
    totalReviews: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}