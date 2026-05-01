import mongoose, { Types } from "mongoose";

export interface PostInterface {
    _id?: Types.ObjectId;
    content: string;
    userId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    files?: { url: string; type: string }[];
    tags: string[];
    visibility?: string;
    createdAt: Date;
    updatedAt: Date;
}
