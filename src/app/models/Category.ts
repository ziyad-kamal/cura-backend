/*
filtering
search
parent categories
analytics
*/

import mongoose, { Schema } from "mongoose";
import { CategoryInterface } from "../../interfaces/models/CategoryInterface.js";

const categorySchema = new Schema<CategoryInterface>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        image: String,

        parentCategory: {
            type: Schema.Types.ObjectId,
            ref: "Category",
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

const Category = mongoose.model<CategoryInterface>(
    "Category",
    categorySchema
);

export default Category;