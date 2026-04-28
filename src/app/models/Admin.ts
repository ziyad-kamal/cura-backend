import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { AdminInterface } from "../../interfaces/models/AdminInterface.ts";

const adminSchema = new Schema<AdminInterface>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
        },
        phone: {
            type: Number,
            required: true,
            equal: 11,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxLength: 80,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        versionKey: false,
    },
    { timestamps: true },
);

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
});

adminSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model<AdminInterface>("Admin", adminSchema);

export default Admin;
