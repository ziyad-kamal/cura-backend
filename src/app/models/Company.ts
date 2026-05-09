import mongoose, { Model, Schema } from "mongoose";
import { CompanyInterface } from '../../interfaces/models/CompanyInterface.js';
import "./Comment.ts";
import "./User.ts";

const companySchema = new Schema<CompanyInterface>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: String,
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Company: Model<CompanyInterface> = mongoose.model<CompanyInterface>("Company", companySchema);

export default Company;
