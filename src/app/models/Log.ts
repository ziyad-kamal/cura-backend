import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
    {
        level: {
            type: String,
            enum: ["info", "warn", "error", "debug"],
            required: true,
        },
        method: { type: String },
        url: { type: String },
        statusCode: { type: Number },
        responseTime: { type: Number },
        ip: { type: String },
        userId: { type: String },
        message: { type: String },
        error: { type: String },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Log = mongoose.model("Log", logSchema);
