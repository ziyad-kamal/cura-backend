import mongoose from "mongoose";

export interface WishlistInterface {
    userId: mongoose.Types.ObjectId;

    products: mongoose.Types.ObjectId[];

    createdAt?: Date;
    updatedAt?: Date;
}