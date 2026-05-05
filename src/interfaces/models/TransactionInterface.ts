import mongoose, { Types } from "mongoose";

export interface TransactionInterface {
    _id?: Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    consultationId: mongoose.Types.ObjectId;
    bankTransactionId: string;
    createdAt: Date;
}
