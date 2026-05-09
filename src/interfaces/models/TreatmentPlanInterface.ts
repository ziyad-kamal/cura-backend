import mongoose, { Types } from "mongoose";

export interface TreatmentPlanInterface {
    _id?: Types.ObjectId;
    diagnosis: string;
    description: string;
    medications?: string;
    procedures?: string;
    status: string;
    startDate: Date;
    endDate: Date;
    user: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    consultation: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
