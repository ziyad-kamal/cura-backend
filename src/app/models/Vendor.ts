import mongoose, { Schema } from "mongoose";
import { VendorInterface } from "../../interfaces/models/VendorInterface.js";

const vendorSchema = new Schema<VendorInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        storeName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },

        storeSlug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            maxlength: 500,
            trim: true,
        },

        logo: {
            type: String,
        },

        banner: {
            type: String,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        ratingAverage: {
            type: Number,
            default: 0,
        },

        totalSales: {
            type: Number,
            default: 0,
        },

        bankAccount: {
            accountName: {
                type: String,
                trim: true,
            },

            accountNumber: {
                type: String,
                trim: true,
            },

            bankName: {
                type: String,
                trim: true,
            },
        },

        socialLinks: {
            facebook: String,
            instagram: String,
            website: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    },
);

const Vendor = mongoose.model<VendorInterface>(
    "Vendor",
    vendorSchema
);

export default Vendor;