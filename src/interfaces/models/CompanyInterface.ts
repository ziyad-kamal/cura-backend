import mongoose, { Types } from "mongoose";

export interface CompanyInterface {
    _id?: Types.ObjectId;
    name: string;
    image?: string;
    admin: mongoose.Types.ObjectId;
    createdAt?: Date;
}
