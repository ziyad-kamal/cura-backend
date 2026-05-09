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
            required: true,
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
        type: {
            type: String,
            enum: ["post", "comment"],
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

const Like: Model<LikeInterface> = mongoose.model<LikeInterface>("Like", likeSchema);

export default Like;
