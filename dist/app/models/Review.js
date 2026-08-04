import mongoose, { Schema } from "mongoose";
const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    rating: {
        type: Number,
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
const Review = mongoose.model("Review", reviewSchema);
export default Review;
//# sourceMappingURL=Review.js.map