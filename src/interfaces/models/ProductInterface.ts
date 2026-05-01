import mongoose, { Types } from "mongoose";

export interface ProductInterface {
    _id?: Types.ObjectId;
    adminId?: mongoose.Types.ObjectId;
    companyId?: mongoose.Types.ObjectId;
    price: number;
    name: string;
    isActive?: boolean;
    tags: string[];
    description: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}
