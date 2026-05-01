import mongoose, { Types } from "mongoose";

export interface CompanyInterface {
        _id?: Types.ObjectId;
    
    adminId: mongoose.Types.ObjectId;
    name: string;
    image?: string;
    createdAt?: Date;
}
