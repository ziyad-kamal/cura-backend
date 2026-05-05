import mongoose, { Types } from "mongoose";

export interface ConsultationInterface {
    _id?: Types.ObjectId;
    price: number;
    type: string;
    status: string;
    userId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    createdAt: Date;
}
