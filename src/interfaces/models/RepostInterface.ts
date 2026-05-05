import mongoose, { Types } from "mongoose";

export interface RepostInterface {
    _id?: Types.ObjectId;
    content: string;
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
}
