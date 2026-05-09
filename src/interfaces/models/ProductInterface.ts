import mongoose, { Types } from "mongoose";

export interface ProductInterface {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    isActive?: boolean;
    admin: mongoose.Types.ObjectId;
    company: mongoose.Types.ObjectId;
    createdAt: Date;
}
