import mongoose, { Model, Schema } from "mongoose";
import { CommentInterface } from "../../interfaces/models/CommentInterface.ts";

const commentSchema = new Schema<CommentInterface>(
    {
        content: {
            type: String,
            required: [true, "Comment cannot be empty"],
            trim: true,
            maxLength: [500, "Comment cannot exceed 500 characters"],
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
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

commentSchema.index({ post: 1, createdAt: -1 });

const Comment: Model<CommentInterface> = mongoose.model<CommentInterface>("Comment", commentSchema);

export default Comment;
