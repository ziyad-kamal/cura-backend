import mongoose, { Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
const transactionSchema = new Schema({
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
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
//# sourceMappingURL=Transaction.js.map