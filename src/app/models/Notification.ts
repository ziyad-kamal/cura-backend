import mongoose, { Schema } from "mongoose";
import { NotificationInterface } from '../../interfaces/models/NotificationsInterface.js';

const notificationSchema = new Schema<NotificationInterface>(
    {
        type: {
            type: String,
            enum: ["like", "comment", "connection", "message"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

notificationSchema.index({ receiver: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
