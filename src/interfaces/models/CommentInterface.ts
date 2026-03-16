import mongoose from "mongoose";

export interface CommentInterface extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
