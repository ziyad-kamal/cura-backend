import mongoose, { Model, Schema } from "mongoose";
import { OrderInterface } from "../../interfaces/models/OrderInterface.js";
import { OrderItemInterface } from "../../interfaces/models/OrderItemInterface.js";
import "./Comment.js";
import "./User.js";

const orderItemSchema = new Schema<OrderItemInterface>(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false },
);

const orderSchema = new Schema<OrderInterface>(
    {
        totalPrice: {
            type: Number,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "in transit", "delivered", "cancelled"],
            default: "pending",
        },
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
        products: {
            type: [orderItemSchema],
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Order: Model<OrderInterface> = mongoose.model<OrderInterface>("Order", orderSchema);

export default Order;
