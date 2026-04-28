import mongoose from "mongoose";

export interface CompanyInterface {
    adminId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    createdAt: Date;
}
