import mongoose, { Model, Schema } from "mongoose";
import { PostInterface } from "../../interfaces/models/PostInterface.ts";
import "../models/Comment.ts";
import "../models/User.ts";

const postSchema = new Schema<PostInterface>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        files: {
            type: String,
            enum: ["video", "document", "image"],
        },
        tags: {
            type: [String],
            default: [],
            required: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    },
);

postSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post",
});

postSchema.virtual("commentsCount", {
    ref: "Comment",
    localField: "_id",
    foreignField: "post",
    count: true,
});

postSchema.index({ title: "text", content: "text" });
postSchema.index({ createdAt: -1 });

const Post: Model<PostInterface> = mongoose.model<PostInterface>("Post", postSchema);

export default Post;
