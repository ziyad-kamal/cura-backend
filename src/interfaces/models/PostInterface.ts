import mongoose, { Types } from "mongoose";

export interface PostInterface {
    _id?: Types.ObjectId;
    content: string;
    files?: { url: string; type: string }[];
    tags: string[];
    visibility?: string;
    userId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
