import mongoose, { Types } from "mongoose";

export interface ProductInterface {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    isActive?: boolean;
    adminId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    createdAt: Date;
}
