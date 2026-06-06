import mongoose from "mongoose";

export interface CartInterface {
    userId: mongoose.Types.ObjectId;

    items: {
        productId: mongoose.Types.ObjectId;
        vendorId: mongoose.Types.ObjectId;

        quantity: number;

        price: number;
    }[];

    totalPrice: number;

    createdAt?: Date;
    updatedAt?: Date;
}