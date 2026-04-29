import mongoose from "mongoose";

export interface RepostInterface {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    content: string;
}
