import mongoose, { Types } from "mongoose";

export interface ConnectionInterface {
    _id?: Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    status: "pending" | "ignored" | "accepted";
    createdAt?: Date;
    updatedAt?: Date;
}
