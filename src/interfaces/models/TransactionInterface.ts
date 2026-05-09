import mongoose, { Types } from "mongoose";

export interface TransactionInterface {
    _id?: Types.ObjectId;
    order: mongoose.Types.ObjectId;
    consultation: mongoose.Types.ObjectId;
    bankTransactionId: string;
    createdAt: Date;
}
