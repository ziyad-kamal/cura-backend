import mongoose, { Types } from "mongoose";

export interface CompanyInterface {
    _id?: Types.ObjectId;
    name: string;
    image?: string;
    adminId: mongoose.Types.ObjectId;
    createdAt?: Date;
}
