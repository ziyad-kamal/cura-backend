import mongoose, { Model, Schema } from "mongoose";
import { MessageInterface } from "../../interfaces/models/MessageInterface.ts";
import "./Comment.ts";
import "./User.ts";

const messageSchema = new Schema<MessageInterface>(
    {
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
        content: {
            type: String,
            required: true,
            maxLength: 500,
        },

        files: {
            type: [String],
            enum: ["video", "image", "document"],
        },
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Message: Model<MessageInterface> = mongoose.model<MessageInterface>("Message", messageSchema);

export default Message;
