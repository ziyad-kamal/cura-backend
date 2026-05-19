import  { HydratedDocument, Model } from "mongoose";
import { PostDataInterface } from "../../../interfaces/data/PostDataInterface.js";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import Post from "../../models/Post.js";
import { findRecord } from "../../utils/findRecord.js";
import Repost from "../../models/Repost.js";
import { RepostInterface } from "../../../interfaces/models/RepostInterface.js";

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


export const storeCommentRepo = async ({
    content,
    files,
    user,
    tags,
    visibility,
}: PostDataInterface): Promise<HydratedDocument<PostInterface>> => {
    return (await Post.create({ user, content, files, tags, visibility })).populate("user");
};

export const updatePostRepo = async ({
    content,
    files,
    _id,
}: PostDataInterface): Promise<HydratedDocument<PostInterface> | null> => {
    await findRecord(Post, { _id });
    return await Post.findByIdAndUpdate(_id, { content, files }, { new: true, runValidators: true }).populate("user");
};

export const likePostRepo = async (_id: string, authId: string, type: string): Promise<boolean> => {
    let post;
    let like;
    if (type === "repost") {
        post = await findRecord(Repost, { _id });
        like = await Like.findOne({ repost: post._id, user: authId, type: "repost" });
    } else {
        post = await findRecord(Post, { _id });
        like = await Like.findOne({ post: _id, user: authId, type: "post" });
    }

    if (like) {
        await Like.deleteOne({ _id: like._id });
        return false;
    }

    if (type === "repost") {
        await Like.create({ repost: post._id, user: authId, type });
        return true;
    }
    await Like.create({ post: post._id, user: authId, type });
    return true;
};

export const repostRepo = async (
    _id: string,
    authId: string,
    { type, content }: { type: string; content: string },
): Promise<boolean> => {
    let postId: string;

    if (type === "repost") {
        const repostDoc = await findRecord(Repost, { _id });
        const populated = await repostDoc.populate("post");
        postId = populated.post._id.toString();
    } else {
        const postDoc = await findRecord(Post, { _id });
        postId = postDoc._id.toString();
    }

    const existingRepost = await Repost.findOne({ post: postId, user: authId });
    if (existingRepost) {
        await Repost.deleteOne({ _id: existingRepost._id });
        return false;
    }

    await Repost.create({ post: postId, user: authId, content });
    return true;
};

export const updateRepostRepo = async (
    _id: string,
    content?: string,
): Promise<HydratedDocument<RepostInterface> | null> => {
    await findRecord(Repost, { _id });

    return await Repost.findByIdAndUpdate(_id, { content }, { new: true, runValidators: true })
        .populate("user")
        .populate("post");
};

export const deletePostRepo = async (_id: string, type: string): Promise<void> => {
    // const session = await mongoose.startSession();

    // await session.withTransaction(async () => {
    if (type === "repost") {
        await findRecord(Repost, { _id });
        await Repost.deleteOne({ _id });
        await Like.deleteMany({ repost: _id });
        await Comment.deleteMany({ repost: _id });
        return;
    }
    await findRecord(Post, { _id });
    await Post.deleteOne({ _id });
    await Like.deleteMany({ post: _id });
    await Comment.deleteMany({ post: _id });
    // });

    // await session.endSession();
};
