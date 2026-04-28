import mongoose, { Model, Schema } from "mongoose";
import { LikeInterface } from "../../interfaces/models/LikeInterface.ts";
import "./Comment.ts";
import "./User.ts";

const likeSchema = new Schema<LikeInterface>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            enum: ["like", "comment"],
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

const Like: Model<LikeInterface> = mongoose.model<LikeInterface>("like", likeSchema);

export default Like;
