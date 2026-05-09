import { Types } from "mongoose";

export interface OrderItemInterface {
    product: Types.ObjectId;
    amount: number;
}
