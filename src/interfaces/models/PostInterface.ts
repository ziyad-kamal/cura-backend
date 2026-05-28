import mongoose, { Types } from "mongoose";

export interface PostInterface {
    _id?: Types.ObjectId;
    id?: string;
    content: string;
    files?: { s3Key: string; type: string }[];
    tags: string[];
    visibility?: string;
    user: mongoose.Types.ObjectId;
    admin: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
