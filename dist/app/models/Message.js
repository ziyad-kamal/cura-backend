import mongoose, { Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
const messageSchema = new Schema({
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
                enum: ["video", "image", "document", 'application'],
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
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const Message = mongoose.model("Message", messageSchema);
export default Message;
//# sourceMappingURL=Message.js.map