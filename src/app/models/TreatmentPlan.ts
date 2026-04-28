import mongoose, { Model, Schema } from "mongoose";
import "./Comment.ts";
import "./User.ts";
import { TreatmentPlanInterface } from "../../interfaces/models/TreatmentPlanInterface.ts";

const treatmentPlanSchema = new Schema<TreatmentPlanInterface>(
    {
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
        diagnosis: {
            type: String,
            required: true,
            maxLength: 50,
        },
        description: {
            type: String,
            required: true,
            maxLength: 500,
        },

        medications: [String],
        procedures:  [String],

        status: {
            type:String,
            enum:['active','inActive']
        },
        startDate: String,
        endDate: String,
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
