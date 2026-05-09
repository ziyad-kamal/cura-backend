import mongoose, { Model, Schema } from "mongoose";
import { RepostInterface } from '../../interfaces/models/RepostInterface.js';
import "./Comment.ts";
import "./User.ts";

const repostSchema = new Schema<RepostInterface>(
    {
        content:{
            type:String,
            trim:true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
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
