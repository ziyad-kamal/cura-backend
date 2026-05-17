import mongoose, { Types } from "mongoose";

export interface CommentInterface {
    _id?: Types.ObjectId;
    content: string;
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    repost: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
