import mongoose, { Types } from "mongoose";

export interface RepostInterface {
    _id?: Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    content: string;
}
