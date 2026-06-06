import mongoose, { Model, Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
import { ChatroomInterface } from '../../interfaces/models/ChatroomInterface.js';

const chatroomSchema = new Schema<ChatroomInterface>(
    {
        isActive: {
            type: Boolean,
            default: true,
        },
        activeUntil: Date,

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        isRead: {
            type: Boolean,
            default: false,
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
        consultation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
        },

        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Chatroom: Model<ChatroomInterface> = mongoose.model<ChatroomInterface>("Chatroom", chatroomSchema);

export default Chatroom;
