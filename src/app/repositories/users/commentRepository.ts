import { HydratedDocument, Model } from "mongoose";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import { findRecord } from "../../utils/findRecord.js";
import { CommentInterface } from "../../../interfaces/models/CommentInterface.js";
import { CommentDataInterface } from "../../../interfaces/data/CommentDataInterface.js";

export const indexCommentRepo = async <T>(
    query: {
        [key: string]: unknown;
    },
    limit: number,
    post: Model<T>,
    _id: string,
) => {
    await findRecord(post, { _id });
    return await Comment.find(query)
        .select("content  createdAt")
        .populate("likesCount")
        .populate("user", "name.first name.last image")
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean();
};

export const storeCommentRepo = async <T>(
    { content }: CommentDataInterface,
    user: string,
    post: { model: Model<T>; key: string },
    _id: string,
): Promise<HydratedDocument<CommentInterface>> => {
    await findRecord(post.model, { _id });

    return (await Comment.create({ content, user, [post.key]: _id })).populate("user",' name.first name.last image');
};

export const updateCommentRepo = async (
    { content }: CommentDataInterface,
    _id: string,
): Promise<HydratedDocument<CommentInterface>> => {
    await findRecord(Comment, { _id });

    return await Comment.findByIdAndUpdate(
        _id,
        { content },
        { new: true, runValidators: true },
    ).populate("user",'name.first name.last image') as HydratedDocument<CommentInterface>;
};

export const likeCommentRepo = async (_id: string, authId: string): Promise<void> => {
    await findRecord(Comment, { _id });
    await Like.create({ user: authId, comment: _id });
};

export const destroyCommentRepo = async (_id: string): Promise<void> => {
    await findRecord(Comment, { _id });
    await Comment.findByIdAndDelete(_id);
};
