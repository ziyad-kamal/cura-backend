import mongoose from "mongoose";

export interface DoctorReviewInterface {
    userId: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    consultationId?: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
