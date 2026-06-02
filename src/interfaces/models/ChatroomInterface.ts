import mongoose, { Types } from "mongoose";

export interface ChatroomInterface {
    _id?: Types.ObjectId;
    lastMessage?: Types.ObjectId;
    activeUntil: Date;
    isActive: boolean;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    consultation: mongoose.Types.ObjectId;
    createdAt: Date;
}
