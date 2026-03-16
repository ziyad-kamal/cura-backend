import bcrypt from "bcryptjs";
import mongoose, { Model, Schema } from "mongoose";
import { UserInterface } from "../../interfaces/models/UserInterface.ts";

const userSchema = new Schema<UserInterface>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        fullName: {
            type: String,
            maxlength: [60, "Password must not be more then 60"],
        },
        imagePath: {
            type: String,
        },
        bio: {
            type: String,
            maxlength: 280,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = function (
    password: string,
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User: Model<UserInterface> = mongoose.model<UserInterface>(
    "User",
    userSchema,
);

export default User;
