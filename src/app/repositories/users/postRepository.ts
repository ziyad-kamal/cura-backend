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

export const indexPostsRepo = async (authId: string, cursor?: string) => {
    const authObjectId = new mongoose.Types.ObjectId(authId);

    const connections = await Connection.find({
        status: "accepted",
        $or: [{ sender: authObjectId }, { receiver: authObjectId }],
    })
        .select("sender receiver")
        .lean();

    const userIds = connections.map((connection) =>
        connection.sender.toString() === authId ? connection.receiver : connection.sender,
    );

    userIds.push(authObjectId);

    const cursorQuery = cursor
        ? {
              createdAt: {
                  $lt: new Date(cursor),
              },
          }
        : {};

    let connectionLimit;
    let publicLimit;
    let repostLimit;

    if (userIds.length > 20) {
        connectionLimit = 5;
        publicLimit = 3;
        repostLimit = 2;
    } else {
        connectionLimit = 2;
        publicLimit = 7;
        repostLimit = 1;
    }

    // =========================
    // FIRST STAGE:
    // ONLY MATCH + SORT + LIMIT
    // =========================

    const [result] = await Post.aggregate([
        {
            $facet: {
                connectionPosts: [
                    {
                        $match: {
                            ...cursorQuery,
                            user: {
                                $in: userIds,
                            },
                        },
                    },

                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },

                    {
                        $limit: connectionLimit + 1,
                    },

                    {
                        $addFields: {
                            type: "post",
                        },
                    },
                ],

                publicPosts: [
                    {
                        $match: {
                            ...cursorQuery,
                            visibility: "public",

                            user: {
                                $nin: userIds,
                            },
                        },
                    },

                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },

                    {
                        $limit: publicLimit + 1,
                    },

                    {
                        $addFields: {
                            type: "post",
                        },
                    },
                ],
            },
        },
    ]);

    const reposts = await Repost.aggregate([
        {
            $match: {
                ...cursorQuery,

                user: {
                    $in: userIds,
                },
            },
        },

        {
            $sort: {
                createdAt: -1,
            },
        },

        {
            $limit: repostLimit + 1,
        },

        {
            $addFields: {
                type: "repost",
            },
        },
    ]);

    // =========================
    // MERGE + SORT
    // =========================

    const feedIds = [...result.connectionPosts, ...result.publicPosts, ...reposts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, connectionLimit + publicLimit + repostLimit);

    const ids = feedIds.map((item) => item._id);

    // =========================
    // SECOND STAGE:
    // LOOKUPS ONLY ON LIMITED DOCS
    // =========================

    const commonPipeline: PipelineStage[] = [
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            "name.first": 1,
                            "name.last": 1,
                            image: 1,
                        },
                    },
                ],
                as: "user",
            },
        },

        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            },
        },

        // latest comments
        {
            $lookup: {
                from: "comments",
                let: {
                    docId: "$_id",
                    docType: "$type",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            {
                                                $eq: ["$$docType", "post"],
                                            },
                                            {
                                                $eq: ["$post", "$$docId"],
                                            },
                                        ],
                                    },

                                    {
                                        $and: [
                                            {
                                                $eq: ["$$docType", "repost"],
                                            },
                                            {
                                                $eq: ["$repost", "$$docId"],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },

                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },

                    {
                        $limit: 2,
                    },

                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        "name.first": 1,
                                        "name.last": 1,
                                        image: 1,
                                    },
                                },
                            ],
                            as: "user",
                        },
                    },

                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },

                    {
                        $lookup: {
                            from: "likes",
                            let: {
                                commentId: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$comment", "$$commentId"],
                                        },
                                    },
                                },

                                {
                                    $group: {
                                        _id: null,

                                        count: {
                                            $sum: 1,
                                        },

                                        isLiked: {
                                            $max: {
                                                $cond: [
                                                    {
                                                        $eq: ["$user", authObjectId],
                                                    },
                                                    1,
                                                    0,
                                                ],
                                            },
                                        },
                                    },
                                },
                            ],
                            as: "likesMeta",
                        },
                    },

                    {
                        $addFields: {
                            likesCount: {
                                $ifNull: [
                                    {
                                        $arrayElemAt: ["$likesMeta.count", 0],
                                    },
                                    0,
                                ],
                            },

                            isLiked: {
                                $eq: [
                                    {
                                        $arrayElemAt: ["$likesMeta.isLiked", 0],
                                    },
                                    1,
                                ],
                            },
                        },
                    },

                    {
                        $project: {
                            content: 1,
                            createdAt: 1,
                            user: 1,
                            likesCount: 1,
                            isLiked: 1,
                        },
                    },
                ],
                as: "comments",
            },
        },

        // comments count
        {
            $lookup: {
                from: "comments",
                let: {
                    docId: "$_id",
                    docType: "$type",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            {
                                                $eq: ["$$docType", "post"],
                                            },
                                            {
                                                $eq: ["$post", "$$docId"],
                                            },
                                        ],
                                    },

                                    {
                                        $and: [
                                            {
                                                $eq: ["$$docType", "repost"],
                                            },
                                            {
                                                $eq: ["$repost", "$$docId"],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },

                    {
                        $count: "count",
                    },
                ],
                as: "commentsMeta",
            },
        },

        // likes
        {
            $lookup: {
                from: "likes",
                let: {
                    docId: "$_id",
                    docType: "$type",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            {
                                                $eq: ["$$docType", "post"],
                                            },
                                            {
                                                $eq: ["$post", "$$docId"],
                                            },
                                        ],
                                    },

                                    {
                                        $and: [
                                            {
                                                $eq: ["$$docType", "repost"],
                                            },
                                            {
                                                $eq: ["$repost", "$$docId"],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },

                    {
                        $group: {
                            _id: null,

                            count: {
                                $sum: 1,
                            },

                            isLiked: {
                                $max: {
                                    $cond: [
                                        {
                                            $eq: ["$user", authObjectId],
                                        },
                                        1,
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ],
                as: "likesMeta",
            },
        },

        // reposts
        {
            $lookup: {
                from: "reposts",
                let: {
                    docId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$post", "$$docId"],
                            },
                        },
                    },

                    {
                        $group: {
                            _id: null,

                            count: {
                                $sum: 1,
                            },

                            isRepost: {
                                $max: {
                                    $cond: [
                                        {
                                            $eq: ["$user", authObjectId],
                                        },
                                        1,
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ],
                as: "repostsMeta",
            },
        },

        {
            $addFields: {
                commentsCount: {
                    $ifNull: [
                        {
                            $arrayElemAt: ["$commentsMeta.count", 0],
                        },
                        0,
                    ],
                },

                likesCount: {
                    $ifNull: [
                        {
                            $arrayElemAt: ["$likesMeta.count", 0],
                        },
                        0,
                    ],
                },

                repostsCount: {
                    $ifNull: [
                        {
                            $arrayElemAt: ["$repostsMeta.count", 0],
                        },
                        0,
                    ],
                },

                isLiked: {
                    $eq: [
                        {
                            $arrayElemAt: ["$likesMeta.isLiked", 0],
                        },
                        1,
                    ],
                },

                isRepost: {
                    $eq: [
                        {
                            $arrayElemAt: ["$repostsMeta.isRepost", 0],
                        },
                        1,
                    ],
                },
            },
        },

        {
            $project: {
                content: 1,
                files: 1,
                tags: 1,
                visibility: 1,
                createdAt: 1,
                user: 1,
                post: 1,
                type: 1,

                comments: 1,
                commentsCount: 1,

                likesCount: 1,
                repostsCount: 1,

                isLiked: 1,
                isRepost: 1,
            },
        },
    ];

    const posts = await Post.aggregate([
        {
            $match: {
                _id: {
                    $in: ids,
                },
            },
        },

        {
            $addFields: {
                type: "post",
            },
        },

        ...commonPipeline,
    ]);

    const repostDocs = await Repost.aggregate([
        {
            $match: {
                _id: {
                    $in: ids,
                },
            },
        },

        {
            $addFields: {
                type: "repost",
            },
        },

        {
            $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            content: 1,
                            files: 1,
                            tags: 1,
                            visibility: 1,
                            createdAt: 1,
                            user: 1,
                        },
                    },
                ],
                as: "post",
            },
        },

        {
            $unwind: {
                path: "$post",
                preserveNullAndEmptyArrays: true,
            },
        },

        ...commonPipeline,
    ]);

    const feed = [...posts, ...repostDocs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const hasMore =
        result.connectionPosts.length > connectionLimit ||
        result.publicPosts.length > publicLimit ||
        reposts.length > repostLimit;

    const lastItem = feed[feed.length - 1];

    const nextCursor = hasMore && lastItem ? new Date(lastItem.createdAt).toISOString() : null;

    return {
        feed,
        hasMore,
        nextCursor,
    };
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
    let post;
    let like;
    if (type === "repost") {
        post = await findRecord(Repost, { _id });
        like = await Like.findOne({ repost: post._id, user: authId });
    } else {
        post = await findRecord(Post, { _id });
        like = await Like.findOne({ post: post._id, user: authId });
    }

    if (like) {
        await Like.deleteOne({ _id: like._id });
        return false;
    }

    if (type === "repost") {
        await Like.create({ repost: post._id, user: authId });
        return true;
    }
    await Like.create({ post: post._id, user: authId });
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
