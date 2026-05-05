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
    userId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    consultationId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
