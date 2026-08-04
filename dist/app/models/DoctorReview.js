import mongoose, { Schema } from "mongoose";
const doctorReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    consultationId: {
        type: Schema.Types.ObjectId,
        ref: "Consultation",
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
// Unique index to ensure a user can only review a doctor once
doctorReviewSchema.index({ userId: 1, doctorId: 1 }, { unique: true });
const DoctorReview = mongoose.model("DoctorReview", doctorReviewSchema);
export default DoctorReview;
//# sourceMappingURL=DoctorReview.js.map