import mongoose from "mongoose";

export interface TreatmentPlanInterface {
    userId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    diagnosis: string;
    description: string;
    medications: string[];
    procedures: string[];
    status: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
