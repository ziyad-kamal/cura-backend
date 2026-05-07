import mongoose, { Model, Schema } from "mongoose";
import { TreatmentPlanInterface } from "../../interfaces/models/TreatmentPlanInterface.ts";
import "./Comment.ts";
import "./User.ts";

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
        consultationId: {
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
