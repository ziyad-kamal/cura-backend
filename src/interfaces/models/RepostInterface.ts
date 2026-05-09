import mongoose, { Types } from "mongoose";

export interface RepostInterface {
    _id?: Types.ObjectId;
    content: string;
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
}
