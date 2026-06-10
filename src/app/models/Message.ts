import mongoose, { Model, Schema } from "mongoose";
import { MessageInterface } from "../../interfaces/models/MessageInterface.js";
import "./Comment.js";
import "./User.js";

const messageSchema = new Schema<MessageInterface>(
    {
        content: {
            type: String,
            maxLength: 500,
            trim: true,
        },
        files: [
            {
                s3Key: String,
                type: {
                    type: String,
                    enum: ["video", "image", "document",'application'],
                },
            },
        ],
        isRead: {
            type: Boolean,
            default: false,
        },
        chatroom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chatroom",
            required: true,
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
        createdAt: Date,
    },
    {
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    },
);

const Message: Model<MessageInterface> = mongoose.model<MessageInterface>("Message", messageSchema);

export default Message;
