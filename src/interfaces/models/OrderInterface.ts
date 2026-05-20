import mongoose from "mongoose";

export interface OrderInterface {
    userId: mongoose.Types.ObjectId;

    totalPrice: number;

    paymentStatus: "pending" | "paid" | "failed";

    orderStatus:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled";

    shippingAddress: {
        city: string;
        street: string;
    };

    createdAt?: Date;
    updatedAt?: Date;
}