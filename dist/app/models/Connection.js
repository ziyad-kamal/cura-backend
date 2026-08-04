import mongoose, { Schema } from "mongoose";
const connectionSchema = new Schema({
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
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });
export default mongoose.model("Connection", connectionSchema);
//# sourceMappingURL=Connection.js.map