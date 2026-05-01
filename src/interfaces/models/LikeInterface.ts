import mongoose, { Types } from "mongoose";

export interface LikeInterface {
    _id?: Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    commentId?: mongoose.Types.ObjectId;
    type:string
}
