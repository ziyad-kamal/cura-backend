import mongoose, { HydratedDocument, PipelineStage } from "mongoose";
import { PostDataInterface } from "../../../interfaces/data/PostDataInterface.js";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import Post from "../../models/Post.js";
import { findRecord } from "../../utils/findRecord.js";
import Repost from "../../models/Repost.js";
import Connection from "../../models/Connection.js";
import { RepostInterface } from "../../../interfaces/models/RepostInterface.js";

export const indexPostsRepo = async (authId: string, cursor: string|undefined) => {
    const connections = await Connection.find({
        status: "accepted",
        $or: [{ sender: authId }, { receiver: authId }],
    }).select("sender receiver");

    const userIds = connections.map((connection) =>
        connection.sender.toString() === authId ? connection.receiver : connection.sender,
    );

    userIds.push(new mongoose.Types.ObjectId(authId));

    // shared lookup stages typed for regular aggregate
    const sharedLookupStages: PipelineStage[] = [
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

    // reuse for $facet by casting
    const sharedLookups = sharedLookupStages as PipelineStage.FacetPipelineStage[];
    // apply cursor to query
    const cursorQuery = cursor ?{ createdAt: { $lt: new Date(cursor) } }: {};

    // fetch limit + 1 to detect hasMore
    let connectionLimit;
    let publicLimit;
    let repostLimit;

    if (userIds.length > 20) {
        connectionLimit = 5;
        publicLimit = 3;
        repostLimit = 2;
    } else {
        connectionLimit = 2;
        publicLimit = 6;
        repostLimit = 2;
    }

    const [result] = await Post.aggregate([
        {
            $facet: {
                connectionPosts: [
                    { $match: { ...cursorQuery, user: { $in: userIds } } },
                    { $addFields: { type: "post" } },
                    { $sort: { createdAt: -1 } },
                    { $limit: connectionLimit + 1 }, // ← +1 to detect hasMore
                    ...sharedLookups,
                ],
                publicPosts: [
                    { $match: { ...cursorQuery, visibility: "public", user: { $nin: userIds } } },
                    { $addFields: { type: "post" } },
                    { $sort: { createdAt: -1 } },
                    { $limit: publicLimit + 1 }, // ← +1 to detect hasMore
                    ...sharedLookups,
                ],
            },
        },
    ]);

    const reposts = await Repost.aggregate([
        { $match: { ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}), user: { $in: userIds } } },
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
                    { $project: { content: 1, files: 1, tags: 1, visibility: 1, createdAt: 1, user: 1 } },
                ],
            },
        },
        { $unwind: { path: "$post", preserveNullAndEmptyArrays: true } },
        ...sharedLookupStages, // ← regular PipelineStage type
        { $sort: { createdAt: -1 } },
        { $limit: repostLimit + 1 },
    ]);

    // check hasMore from any of the three sources
    const hasMore =
        result.connectionPosts.length > connectionLimit ||
        result.publicPosts.length > publicLimit ||
        reposts.length > repostLimit;

    // trim to actual limits
    const feed = [
        ...reposts.slice(0, repostLimit),
        ...result.connectionPosts.slice(0, connectionLimit),
        ...result.publicPosts.slice(0, publicLimit),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // next cursor is the createdAt of the last item
    const lastItem = feed[feed.length - 1];
    const nextCursor = hasMore && lastItem ? new Date(lastItem.createdAt).toISOString() : null;

    return { feed, hasMore, nextCursor };
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
    await findRecord(Post, { _id });
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
    const post = await findRecord(Repost, { _id });
    const repost = await Repost.findOne({ post: _id, user: authId });
    if (repost) {
        await Repost.deleteOne({ _id: repost._id });
        return false;
    }
    await Repost.create({ post: post._id, user: authId, content });
    return true;
};

export const updateRepostRepo = async (_id: string, content?: string): Promise<HydratedDocument<RepostInterface>|null> => {
    await findRecord(Repost, { _id });
    return await Repost.findByIdAndUpdate(_id, { content }, { new: true, runValidators: true })
        .populate("user")
        .populate("post");
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
