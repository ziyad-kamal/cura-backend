import mongoose, { Types } from "mongoose";

export interface MessageInterface {
    _id?: Types.ObjectId;
    content: string;
    files: { url: string; type: string }[];
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    createdAt: Date;
}
