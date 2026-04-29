import mongoose from "mongoose";

export interface ProductInterface {
    adminId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    price:number;
    name: string;
    tags:string[]
    description: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}
