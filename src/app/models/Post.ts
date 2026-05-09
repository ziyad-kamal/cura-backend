import mongoose, { Model, Schema } from "mongoose";
import { PostInterface } from '../../interfaces/models/PostInterface.js';
import "../models/Comment.js";
import "../models/User.js";
import "../models/Like.js";
import "../models/Repost.js";

const postSchema = new Schema<PostInterface>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        files: [
            {
                url: String,
                type: {
                    type: String,
                    enum: ["video", "document", "image"],
                },
            },
        ],
        tags: {
            type: [String],
            required: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
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

postSchema.virtual("likesCount", {
    ref: "Like",
    localField: "_id",
    foreignField: "post",
    count: true,
});

postSchema.virtual("repostsCount", {
    ref: "Repost",
    localField: "_id",
    foreignField: "post",
    count: true,
});

postSchema.index({ title: "text", content: "text" });
postSchema.index({ createdAt: -1 });

const Post: Model<PostInterface> = mongoose.model<PostInterface>("Post", postSchema);

export default Post;
