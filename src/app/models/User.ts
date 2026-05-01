import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { UserInterface } from "../../interfaces/models/UserInterface.ts";

const userSchema = new Schema<UserInterface>(
    {
        name: {
            first: {
                type: String,
                required: true,
                minlength: 3,
                maxLength: 30,
                trim: true,
            },
            last: {
                type: String,
                required: true,
                minlength: 3,
                maxLength: 30,
                trim: true,
            },
        },

        contact: {
            email: {
                type: String,
                required: true,
                unique: true,
                maxLength: 60,
            },
            phone: {
                type: Number,
                match: /^\d{11}$/,
                trim: true,
            },
            address: {
                city: {
                    type: String,
                    minlength: 3,
                    maxLength: 30,
                    trim: true,
                },
                street: {
                    type: String,
                    minlength: 3,
                    maxLength: 30,
                    trim: true,
                },
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxLength: 40,
            select: false,
        },
        image: String,
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

        doctorInfo: {
            isCertified: {
                type: Boolean,
                default: false,
            },
            frontIdImage: String,
            backIdImage: String,
            certImage: String,
        },

        userInfo: {
            age: {
                type: Number,
                maxLength: 3,
                trim: true,
            },
            weight: Number,
            height: Number,
            gender: {
                type: String,
                enum: ["رجل", "انثى"],
            },
            diseases: [String],
        },

        cardPayment: {
            number:String,
            name: String,
            csv: String,
            expDate: String,
        },

        role: {
            type: String,
            enum: ["user", "doctor"],
        },
    },
    { timestamps: true, versionKey: false },
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
