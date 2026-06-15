import mongoose, { Model, Schema } from "mongoose";
import { RepostInterface } from "../../interfaces/models/RepostInterface.js";
import "./Comment.js";
import "./Post.js";
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
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    },
);

repostSchema.index({ user: 1, createdAt: -1 });
repostSchema.index({ post: 1 });

const Repost: Model<RepostInterface> = mongoose.model<RepostInterface>("Repost", repostSchema);

export default Repost;


