import mongoose, { Model, Schema } from "mongoose";
import { RepostInterface } from "../../interfaces/models/RepostInterface.js";
import "./Comment.js";
import "./User.js";

const repostSchema = new Schema<RepostInterface>(
    {
        content: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

const Repost: Model<RepostInterface> = mongoose.model<RepostInterface>("Repost", repostSchema);

export default Repost;
