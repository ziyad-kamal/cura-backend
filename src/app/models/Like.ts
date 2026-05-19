import mongoose, { Model, Schema } from "mongoose";
import { LikeInterface } from '../../interfaces/models/LikeInterface.js';
import "./Comment.js";
import "./User.js";

const likeSchema = new Schema<LikeInterface>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
        repost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repost",
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    },
    {
        versionKey: false,
    },
);

likeSchema.index({ user: 1, post: 1 });
likeSchema.index({ user: 1, repost: 1 });
likeSchema.index({ user: 1, comment: 1 });

const Like: Model<LikeInterface> = mongoose.model<LikeInterface>("Like", likeSchema);

export default Like;
