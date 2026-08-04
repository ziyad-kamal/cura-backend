import mongoose, { Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
const treatmentPlanSchema = new Schema({
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
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const TreatmentPlan = mongoose.model("TreatmentPlan", treatmentPlanSchema);
export default TreatmentPlan;
//# sourceMappingURL=TreatmentPlan.js.map