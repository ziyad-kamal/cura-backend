import mongoose, { Model, Schema } from "mongoose";
import { ProductInterface } from "../../interfaces/models/ProductInterface.js";
import "./Comment.js";
import "./User.js";

const productSchema = new Schema<ProductInterface>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 40,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            maxLength: 500,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            maxLength: 5,
            trim: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Product: Model<ProductInterface> = mongoose.model<ProductInterface>("Product", productSchema);

export { Product, productSchema };
