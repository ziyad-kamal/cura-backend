import mongoose, { Types } from "mongoose";
import { OrderItemInterface } from './OrderItemInterface.js';

export interface OrderInterface {
    _id?: Types.ObjectId;
    totalPrice: number;
    status: string;
    city: string;
    street: string;
    products: OrderItemInterface[];
    user: mongoose.Types.ObjectId;
    createdAt: Date;
}
