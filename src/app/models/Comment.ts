import mongoose, { Model, Schema } from "mongoose";
import { CommentInterface } from '../../interfaces/models/CommentInterface.js';

const commentSchema = new Schema<CommentInterface>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxLength: 250,
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
        repost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repost",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ repost: 1, createdAt: -1 });

commentSchema.virtual("likesCount", {
    ref: "Like",
    localField: "_id",
    foreignField: "comment",
    count: true,
});

const Comment: Model<CommentInterface> = mongoose.model<CommentInterface>("Comment", commentSchema);

export default Comment;
