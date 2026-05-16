import mongoose, { HydratedDocument, PipelineStage } from "mongoose";
import { PostDataInterface } from "../../../interfaces/data/PostDataInterface.js";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import Post from "../../models/Post.js";
import { findRecord } from "../../utils/findRecord.js";
import Repost from "../../models/Repost.js";
import Connection from "../../models/Connection.js";

export const indexPostsRepo = async (query: object, limit: number, authId: string) => {
    const connections = await Connection.find({
        status: "accepted",
        $or: [{ sender: authId }, { receiver: authId }],
    }).select("sender receiver");

    const userIds = connections.map((connection) =>
        connection.sender.toString() === authId ? connection.receiver : connection.sender,
    );
        console.log("userIds: ", userIds);

    userIds.push(new mongoose.Types.ObjectId(authId));

    const sharedLookups: PipelineStage.FacetPipelineStage[] = [
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
        { $lookup: { from: "comments", localField: "_id", foreignField: "post", as: "allComments" } },
        { $lookup: { from: "likes", localField: "_id", foreignField: "post", as: "allLikes" } },
        { $lookup: { from: "reposts", localField: "_id", foreignField: "post", as: "allReposts" } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "userLike",
                pipeline: [{ $match: { user: new mongoose.Types.ObjectId(authId) } }],
            },
        },
        {
            $lookup: {
                from: "reposts",
                localField: "_id",
                foreignField: "post",
                as: "userRepost",
                pipeline: [{ $match: { user: new mongoose.Types.ObjectId(authId) } }],
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
                type: 1,
                content: 1,
                files: 1,
                visibility: 1,
                tags: 1,
                createdAt: 1,
                user: 1,
                post: 1,
                comments: 1,
                commentsCount: 1,
                likesCount: 1,
                repostsCount: 1,
                isLiked: 1,
                isRepost: 1,
            },
        },
    ];

    const [result] = await Post.aggregate([
        {
            $facet: {
                // 5 posts from connections
                connectionPosts: [
                    {
                        $match: {
                            ...query,
                            user: { $in: userIds },
                        },
                    },
                    { $addFields: { type: "post" } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 5 },
                    ...sharedLookups,
                ],

                // 3 posts from public strangers
                publicPosts: [
                    {
                        $match: {
                            ...query,
                            visibility: "public",
                            user: { $nin: userIds }, 
                        },
                    },
                    { $addFields: { type: "post" } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 3 },
                    ...sharedLookups,
                ],

                // 2 reposts from connections
                reposts: [
                    {
                        $match: { _id: { $exists: false } }, 
                    },
                ],
            },
        },
    ]);

    // 2 reposts from connections
    const reposts = await Repost.aggregate([
        { $match: { user: { $in: userIds } } },
        { $addFields: { type: "repost" } },
        {
            $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "post",
                pipeline: [
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
                    { $project: { content: 1, files: 1, createdAt: 1, user: 1 } },
                ],
            },
        },
        { $unwind: { path: "$post", preserveNullAndEmptyArrays: true } },
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
        { $sort: { createdAt: -1 } },
        { $limit: 2 },
    ]);

    const feed = [
        ...reposts, 
        ...result.connectionPosts, 
        ...result.publicPosts, 
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return feed;
};

export const storePostRepo = async ({
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

export const repostRepo = async (_id: string, authId: string, content?: string): Promise<boolean> => {
    const post = await findRecord(Post, { _id });
    const repost = await Repost.findOne({ post: _id, user: authId });
    if (repost) {
        await Repost.deleteOne({ _id: repost._id });
        return false;
    }
    await Repost.create({ post: post._id, user: authId, content });
    return true;
};

export const deletePostRepo = async (_id: string): Promise<void> => {
    // const session = await mongoose.startSession();

    // await session.withTransaction(async () => {
    await findRecord(Post, { _id });
    await Post.deleteOne({ _id });
    await Comment.deleteMany({ post: _id });
    // });

    // await session.endSession();
};
