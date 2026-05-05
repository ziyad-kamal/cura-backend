import { Types } from "mongoose";

export interface OrderItemInterface {
    productId: Types.ObjectId;
    amount: number;
}
