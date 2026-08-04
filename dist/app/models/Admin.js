import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 80,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    phone: {
        type: Number,
        trim: true,
    },
    role: {
        type: String,
        enum: ["admin", "super admin", "company admin"],
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
adminSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
});
adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
//# sourceMappingURL=Admin.js.map