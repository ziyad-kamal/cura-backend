import mongoose, { Schema } from "mongoose";
import "../models/Comment.js";
import "../models/Like.js";
import "../models/Repost.js";
import "../models/User.js";
const postSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    files: [
        new Schema({
            s3Key: String,
            type: {
                type: String,
                enum: ["video", "document", "image"],
            },
        }, { id: false }),
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
}, {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: {
        virtuals: true,
    },
});
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
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
const Post = mongoose.model("Post", postSchema);
export default Post;
//# sourceMappingURL=Post.js.map