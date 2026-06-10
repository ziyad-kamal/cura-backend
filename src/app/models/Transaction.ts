import mongoose, { Model, Schema } from "mongoose";
import { TransactionInterface } from "../../interfaces/models/TransactionInterface.js";
import "./Comment.js";
import "./User.js";

const transactionSchema = new Schema<TransactionInterface>(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        consultation: {
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
        toJSON: {
            virtuals: true,
        },
    },
);

const Transaction: Model<TransactionInterface> = mongoose.model<TransactionInterface>("Transaction", transactionSchema);

export default Transaction;
