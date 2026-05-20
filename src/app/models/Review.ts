import mongoose, { Schema } from "mongoose";
import { ReviewInterface } from "../../interfaces/models/ReviewInterface.js";

const reviewSchema = new Schema<ReviewInterface>(
    {
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
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Review = mongoose.model<ReviewInterface>(
    "Review",
    reviewSchema
);

export default Review;