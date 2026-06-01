import { Types } from "mongoose";
import { PostVisibility } from "../../enums/PostVisibility.js";
import { PostTag } from "../../enums/PostTag.js";

export interface PostDataInterface {
    content: string;
    files?: { s3Key: string; type: string }[];
    _id?: string;
    user?:Types.ObjectId;
    tags: PostTag[];
    visibility: PostVisibility;
}
