import { Types } from "mongoose";

export interface OwnerInterface {
    user?: Types.ObjectId;
    _id?: Types.ObjectId;
}
