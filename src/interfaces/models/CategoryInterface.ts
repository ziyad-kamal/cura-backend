import mongoose from "mongoose";

export interface CategoryInterface {
    name: string;

    slug: string;

    image?: string;

    parentCategory?: mongoose.Types.ObjectId;

    isActive: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}