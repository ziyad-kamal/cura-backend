import mongoose, { Types } from "mongoose";
import { OrderItemInterface } from "./OrderItemInterface.ts";

export interface OrderInterface {
    _id?: Types.ObjectId;
    totalPrice: number;
    status: string;
    city: string;
    street: string;
    products: OrderItemInterface[];
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}
