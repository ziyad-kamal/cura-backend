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
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
