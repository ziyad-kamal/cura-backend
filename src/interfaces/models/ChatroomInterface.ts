import mongoose, { Types } from "mongoose";

export interface ChatroomInterface {
    _id?: Types.ObjectId;
    isActive: boolean;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    consultationId: mongoose.Types.ObjectId;
    createdAt: Date;
}
