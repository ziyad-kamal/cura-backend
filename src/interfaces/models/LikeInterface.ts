import mongoose from "mongoose";

export interface LikeInterface {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    type: String;
}
