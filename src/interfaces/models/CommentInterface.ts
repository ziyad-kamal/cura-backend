import mongoose from "mongoose";

export interface CommentInterface {
    content: string;
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    parentId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
