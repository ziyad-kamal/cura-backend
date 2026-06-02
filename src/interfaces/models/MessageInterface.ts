import mongoose, { Types } from "mongoose";

export interface MessageInterface {
    _id?: Types.ObjectId;
    content: string;
    files: { s3Key: string; type: string }[];
    isRead: boolean;
    chatroom: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    createdAt: Date;
}
