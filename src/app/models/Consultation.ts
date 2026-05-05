import mongoose, { Model, Schema } from "mongoose";
import { ConsultationInterface } from "../../interfaces/models/ConsultationInterface.ts";
import "./Comment.ts";
import "./User.ts";

const consultationSchema = new Schema<ConsultationInterface>(
    {
        price: {
            type: Number,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["قصيرة المدى", "متوسطة المدى", "طويلة المدى"],
            required: true,
        },
        status: {
            type: String,
            enum: ["معلق", "تم البدء", "في مرحلة التنفيذ", "تم الانتهاء"],
            default: "معلق",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Consultation: Model<ConsultationInterface> = mongoose.model<ConsultationInterface>("Consultation", consultationSchema);

export default Consultation;
