import mongoose, { Model, Schema } from "mongoose";
import { RepostInterface } from "../../interfaces/models/RepostInterface.js";
import "./Comment.js";
import "./Post.js";
import "./User.js";

const repostSchema = new Schema<RepostInterface>(
    {
        content: {
            type: String,
            trim: true,
        },
        files: [
            new Schema(
                {
                    url: String,
                    type: {
                        type: String,
                        enum: ["video", "document", "image"],
                    },
                },
                { id: false },
            ),
        ],
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
    },
    {
        versionKey: false,
    },
);

const Repost: Model<RepostInterface> = mongoose.model<RepostInterface>("Repost", repostSchema);

export default Repost;


