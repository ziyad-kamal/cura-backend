import mongoose, { Schema } from "mongoose";
import { ConnectionInterface } from '../../interfaces/models/ConnectionInterface.js';

const connectionSchema = new Schema<ConnectionInterface>(
    {
        status: {
            type: String,
            enum: ["pending", "ignored", "accepted"],
            default: "pending",
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export default mongoose.model("Connection", connectionSchema);
