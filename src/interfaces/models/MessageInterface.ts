import mongoose from "mongoose";

export interface MessageInterface {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    content: string;
    files: string[];
    createdAt: Date;
}
