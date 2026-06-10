import mongoose, { Types } from "mongoose";
import { UserInterface } from "./UserInterface.js";

export interface MessageInterface {
    _id?: Types.ObjectId;
    content: string;
    files: { s3Key: string; type?: string }[];
    isRead: boolean;
    chatroom: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId | UserInterface;
    receiver: mongoose.Types.ObjectId;
    createdAt: Date;
}
