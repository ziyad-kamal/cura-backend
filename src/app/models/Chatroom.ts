import mongoose, { Model, Schema } from "mongoose";
import "./Comment.ts";
import "./User.ts";
import { ChatroomInterface } from "../../interfaces/models/ChatroomInterface.ts";

const chatroomSchema = new Schema<ChatroomInterface>(
    {
        isActive: {
            type: Boolean,
            default: true,
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
        consultationId: {
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
