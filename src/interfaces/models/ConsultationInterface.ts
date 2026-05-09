import mongoose, { Types } from "mongoose";

export interface ConsultationInterface {
    _id?: Types.ObjectId;
    price: number;
    type: string;
    status: string;
    user: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    createdAt: Date;
}
