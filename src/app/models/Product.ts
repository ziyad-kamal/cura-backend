import mongoose, { Model, Schema } from "mongoose";
import { ProductInterface } from "../../interfaces/models/ProductInterface.ts";
import "./Comment.ts";
import "./User.ts";

const productSchema = new Schema<ProductInterface>(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        name: {
            type: String,
            required: true,
            maxLength: 40,
        },
        description: {
            type: String,
            required: true,
            maxLength: 500,
        },
        price: {
            type: Number,
            required: true,
            maxLength: 5,
        },
        tags: {
            type: [String],
            required: true,
        },

        images: {
            type: [String],
            required:true
        },
        isActive: {
            type:Boolean,
            default:false
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Product: Model<ProductInterface> = mongoose.model<ProductInterface>("Product", productSchema);

export default Product;
