import mongoose, { Model, Schema } from "mongoose";
import { ConsultationInterface } from '../../interfaces/models/ConsultationInterface.js';
import "./Comment.js";
import "./User.js";

const consultationSchema = new Schema<ConsultationInterface>(
    {
        price: {
            type: Number,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["short term", "medium term", "long term"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "started", "in progress", "completed"],
            default: "pending",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdAt: Date,
    },
    {
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    },
);

const Consultation: Model<ConsultationInterface> = mongoose.model<ConsultationInterface>(
    "Consultation",
    consultationSchema,
);

export default Consultation;
