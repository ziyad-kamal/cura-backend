import mongoose from "mongoose";

export interface ReviewInterface {
    userId: mongoose.Types.ObjectId;

    productId: mongoose.Types.ObjectId;

    rating?: number;

    comment?: string;

    createdAt?: Date;
    updatedAt?: Date;
}