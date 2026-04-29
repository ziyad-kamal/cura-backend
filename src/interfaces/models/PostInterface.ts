import mongoose from "mongoose";

export interface PostInterface {
    content: string;
    userId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    files?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    visibility: string;
    id?: number;
}
