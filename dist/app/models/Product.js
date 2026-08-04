import mongoose, { Schema } from "mongoose";
const productSchema = new Schema({
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
    images: [
        new Schema({
            s3Key: String,
            type: {
                type: String,
                enum: ["image"],
            },
        }, { id: false }),
    ],
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
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
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const Product = mongoose.model("Product", productSchema);
export default Product;
//# sourceMappingURL=Product.js.map