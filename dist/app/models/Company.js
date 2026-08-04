import mongoose, { Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: String,
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    createdAt: Date,
}, {
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const Company = mongoose.model("Company", companySchema);
export default Company;
//# sourceMappingURL=Company.js.map