import mongoose, { Types } from "mongoose";

export interface ConnectionInterface {
    _id?: Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    status: "pending" | "ignored" | "accepted";
    createdAt?: Date;
    updatedAt?: Date;
}
