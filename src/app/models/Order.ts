import mongoose, { Schema } from "mongoose";
import { OrderInterface } from "../../interfaces/models/OrderInterface.js";

const orderSchema = new Schema<OrderInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        shippingAddress: {
            city: {
                type: String,
                required: true,
                trim: true,
            },

            street: {
                type: String,
                required: true,
                trim: true,
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Order = mongoose.model<OrderInterface>(
    "Order",
    orderSchema
);

export default Order;