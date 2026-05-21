import { Types } from "mongoose";

export interface RepostDataInterface {
    content: string;
    _id?: string;
    user?: Types.ObjectId;
    post: Types.ObjectId;
}
