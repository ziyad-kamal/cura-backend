import { Model } from "mongoose";
import { PostInterface } from "../models/PostInterface.js";
import { RepostInterface } from "../models/RepostInterface.js";

export interface PostTypeInterface {
    model: Model<PostInterface | RepostInterface>;
    key: string;
}
