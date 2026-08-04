/*
filtering
search
parent categories
analytics
*/
import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema({
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
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const Category = mongoose.model("Category", categorySchema);
export default Category;
//# sourceMappingURL=Category.js.map