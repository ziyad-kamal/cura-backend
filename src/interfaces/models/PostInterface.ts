import mongoose from "mongoose";
import { CommentInterface } from "./CommentInterface.ts";

export interface PostInterface extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    filePath?: string;
    tags: string[];
    likes: mongoose.Types.ObjectId[];
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
    comments?: CommentInterface[];
    commentsCount?: number;
    id?: number;
}
