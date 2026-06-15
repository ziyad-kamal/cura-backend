import mongoose, { Schema } from "mongoose";
import { ConnectionInterface } from '../../interfaces/models/ConnectionInterface.js';

const connectionSchema = new Schema<ConnectionInterface>(
    {
        status: {
            type: String,
            enum: ["pending", "ignored", "accepted"],
            default: "pending",
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export default mongoose.model("Connection", connectionSchema);
