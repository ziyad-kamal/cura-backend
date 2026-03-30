import mongoose, { Model, Schema } from "mongoose";
import { PostInterface } from "../../interfaces/models/PostInterface.ts";
import "../models/Comment.ts";
import "../models/User.ts";

const postSchema = new Schema<PostInterface>(
    {
        title: {
            type: String,
            required: [true, "Post title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Post content is required"],
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        filePath: {
            type: String,
        },
        tags: {
            type: [String],
            default: [],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        likeCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        id: false,
        // toJSON: {
        //     virtuals: true,
        //     transform: (doc, ret) => {
        //         delete ret.id;
        //         return ret;
        //     },
        // },
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
