import mongoose from "mongoose";

export interface OrderItemInterface {
    orderId: mongoose.Types.ObjectId;

    productId: mongoose.Types.ObjectId;

    vendorId: mongoose.Types.ObjectId;

    quantity: number;

    price: number;

    status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled";

    createdAt?: Date;
    updatedAt?: Date;
}