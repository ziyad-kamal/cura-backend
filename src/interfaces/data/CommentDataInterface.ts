import { Types } from "mongoose";

export interface CommentDataInterface {
    content: string;
    postId?: Types.ObjectId;
}
