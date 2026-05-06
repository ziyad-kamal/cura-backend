import mongoose, { Types } from "mongoose";

export interface CommentInterface {
    _id?: Types.ObjectId;
    content: string;
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
