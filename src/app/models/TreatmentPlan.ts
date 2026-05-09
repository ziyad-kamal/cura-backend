import mongoose, { Model, Schema } from "mongoose";
import { TreatmentPlanInterface } from "../../interfaces/models/TreatmentPlanInterface.js";
import "./Comment.js";
import "./User.js";

const treatmentPlanSchema = new Schema<TreatmentPlanInterface>(
    {
        diagnosis: {
            type: String,
            required: true,
            maxLength: 100,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            maxLength: 500,
            trim: true,
        },

        medications: String,
        procedures: String,

        status: {
            type: String,
            enum: ["not started", "in progress", "completed"],
        },
        startDate: String,
        endDate: String,

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
        consultation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
            required: true,
        },
        createdAt: String,
        updatedAt: String,
    },
    {
        versionKey: false,
    },
);

const TreatmentPlan: Model<TreatmentPlanInterface> = mongoose.model<TreatmentPlanInterface>(
    "TreatmentPlan",
    treatmentPlanSchema,
);

export default TreatmentPlan;
