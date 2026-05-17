import mongoose, { Types } from "mongoose";

export interface LikeInterface {
    _id?: Types.ObjectId;
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    repost: mongoose.Types.ObjectId;
    comment?: mongoose.Types.ObjectId;
    type: string;
}
