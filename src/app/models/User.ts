import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { UserRoles } from '../../enums/UserRoles.js';
import { UserInterface } from '../../interfaces/models/UserInterface.js';

const userSchema = new Schema<UserInterface>(
    {
        name: {
            first: {
                type: String,
                required: true,
                minlength: 2,
                maxLength: 30,
                trim: true,
            },
            last: {
                type: String,
                required: true,
                minlength: 2,
                maxLength: 30,
                trim: true,
            },
        },

        contact: {
            email: {
                type: String,
                required: true,
                unique: true,
                minlength: 10,
                maxLength: 150,
                trim: true,
            },
            phone: {
                type: String,
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
                    maxLength: 60,
                    trim: true,
                },
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxLength: 80,
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
            shortConsultPrice: Number,
            normalConsultPrice: Number,
            LongConsultPrice: Number,

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
                enum: ["male", "female"],
            },
            diseases: String,
            medications:String,
            tags: [String],
        },

        cardPayment: {
            number: String,
            name: String,
            cvv: String,
            expDate: String,
        },

        role: {
            type: String,
            enum: Object.values(UserRoles),
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
