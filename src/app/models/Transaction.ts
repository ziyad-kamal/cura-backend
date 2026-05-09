import mongoose, { Model, Schema } from "mongoose";
import "./Comment.ts";
import "./User.ts";
import { TransactionInterface } from '../../interfaces/models/TransactionInterface.js';

const transactionSchema = new Schema<TransactionInterface>(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        consultationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
        },
        bankTransactionId: {
            type: String,
            required: true,
        },

        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Transaction: Model<TransactionInterface> = mongoose.model<TransactionInterface>("Transaction", transactionSchema);

export default Transaction;
