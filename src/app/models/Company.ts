import mongoose, { Model, Schema } from "mongoose";
import { CompanyInterface } from "../../interfaces/models/CompanyInterface.ts";
import "./Comment.ts";
import "./User.ts";

const companySchema = new Schema<CompanyInterface>(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            ref: "User",
            required: true,
        },

        image: String,
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const Company: Model<CompanyInterface> = mongoose.model<CompanyInterface>("Company", companySchema);

export default Company;
