import mongoose, { Schema } from "mongoose";
import { ProductInterface } from "../../interfaces/models/ProductInterface.js";

const productSchema = new Schema<ProductInterface>(
    {
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 120,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            min: 0,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        images: {
            type: [String],
            default: [],
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category"
        },

        brand: {
            type: String,
            trim: true,
        },

        ratingAverage: {
            type: Number,
            default: 0,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Product = mongoose.model<ProductInterface>(
    "Product",
    productSchema
);

export default Product;