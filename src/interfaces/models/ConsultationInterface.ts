import mongoose, { Types } from "mongoose";

export interface ConsultationInterface {
    _id?: Types.ObjectId;
    price: number;
    type: string;
    status: string;
    user: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    chatroom?: mongoose.Types.ObjectId;
    scheduledDay?: string;
    startTime?: string;
    endTime?: string;
    paymentIntentId?: string;
    createdAt: Date;
}
