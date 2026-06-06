import mongoose from "mongoose";

export interface VendorInterface {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    storeName: string;
    storeSlug: string;

    description?: string;

    logo?: string;
    banner?: string;

    isVerified: boolean;
    isActive: boolean;

    ratingAverage: number;

    totalSales: number;

    bankAccount?: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
    };

    socialLinks?: {
        facebook?: string;
        instagram?: string;
        website?: string;
    };

    createdAt?: Date;
    updatedAt?: Date;
}