import mongoose, { HydratedDocument } from "mongoose";
import { PostDataInterface } from "../../../interfaces/data/PostDataInterface.js";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import Post from "../../models/Post.js";
import { findRecord } from "../../utils/findRecord.js";
import Repost from "../../models/Repost.js";

export const indexPostsRepo = async (query: object, limit: number, authId: string) => {
    return Post.aggregate([
        { $match: query },

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [{ $project: { "name.first": 1, "name.last": 1, image: 1 } }],
            },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
                pipeline: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 2 },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                            pipeline: [{ $project: { "name.first": 1, "name.last": 1, image: 1 } }],
                        },
                    },
                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                    { $project: { content: 1, user: 1, createdAt: 1 } },
                ],
            },
        },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "allComments",
            },
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "allLikes",
            },
        },

        {
            $lookup: {
                from: "reposts",
                localField: "_id",
                foreignField: "post",
                as: "allReposts",
            },
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "userLike",
                pipeline: [
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(authId),
                        },
                    },
                ],
            },
        },

        {
            $lookup: {
                from: "reposts",
                localField: "_id",
                foreignField: "post",
                as: "userRepost",
                pipeline: [
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(authId),
                        },
                    },
                ],
            },
        },

        {
            $addFields: {
                commentsCount: { $size: "$allComments" },
                likesCount: { $size: "$allLikes" },
                repostsCount: { $size: "$allReposts" },
                isLiked: { $gt: [{ $size: "$userLike" }, 0] },
                isRepost: { $gt: [{ $size: "$userRepost" }, 0] },
            },
        },

        {
            $project: {
                content: 1,
                files: 1,
                createdAt: 1,
                user: 1,
                comments: 1,
                commentsCount: 1,
                likesCount: 1,
                repostsCount: 1,
                isLiked: 1,
                isRepost: 1,
            },
        },

        { $sort: { createdAt: -1 } },
        { $limit: limit + 1 },
    ]);
};

export const storePostRepo = async ({
    content,
    files,
    user,
    tags,
    visibility,
}: PostDataInterface): Promise<HydratedDocument<PostInterface>> => {
    return (await Post.create({ user, content, files,tags,visibility })).populate("user");
};

export const updatePostRepo = async ({
    content,
    files,
    _id,
}: PostDataInterface): Promise<HydratedDocument<PostInterface> | null> => {
    return await Post.findByIdAndUpdate(_id, { content, files }, { new: true, runValidators: true }).populate("user");
};

export const likePostRepo = async (_id: string, authId: string, type: string): Promise<boolean> => {
    const post = await findRecord(Post, { _id });
    const like = await Like.findOne({ post: _id, user: authId });
    if (like) {
        await Like.deleteOne({ _id: like._id });
        return false;
    }
    await Like.create({ post: post._id, user: authId, type });
    return true;
};

export const repostRepo = async (_id: string, authId: string, { content, files }: PostDataInterface): Promise<boolean> => {
    const post = await findRecord(Post, { _id });
    const repost = await Repost.findOne({ post: _id, user: authId });
    if (repost) {
        await Repost.deleteOne({ _id: repost._id });
        return false;
    }
    await Repost.create({ post: post._id, user: authId ,content, files });
    return true;
};

export const deletePostRepo = async (_id: string): Promise<void> => {
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
        await findRecord(Post, { _id });
        await Post.deleteOne({ _id }, { session });
        await Comment.deleteMany({ post: _id }, { session });
    });

    await session.endSession();
};
