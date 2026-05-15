import mongoose, { Types } from "mongoose";

export interface RepostInterface {
    _id?: Types.ObjectId;
    content: string;
    files:{url:string,type:string}[]
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
}
