import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import mongoose, { PipelineStage } from "mongoose";
import { awsConfig, s3Client } from "../../../../config/aws.js";
import { PostDataInterface } from "../../../../interfaces/data/PostDataInterface.js";
import { RepostDataInterface } from "../../../../interfaces/data/RepostDataInterface.js";
import { PostInterface } from "../../../../interfaces/models/PostInterface.js";
import Comment from "../../../models/Comment.js";
import Connection from "../../../models/Connection.js";
import Like from "../../../models/Like.js";
import Post from "../../../models/Post.js";
import Repost from "../../../models/Repost.js";
import { findRecord } from "../../../utils/findRecord.js";

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
                            "userInfo.job": 1,
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
                                        "userInfo.job": 1,
                                    },
                                },
                            ],
                            as: "user",
                        },
                    },

                    {
                        $unwind: "$user",
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

    let feed = [...posts, ...repostDocs].sort(
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
}: PostDataInterface): Promise<PostInterface> => {
    const post = await (
        await Post.create({ user, content, files, tags, visibility })
    ).populate("user", "name.first name.last image userInfo.job");

    return post.toJSON();
};

export const repostPostRepo = async ({ content, post }: RepostDataInterface, authId: string): Promise<boolean> => {
    await findRecord(Post, { _id: post });
    const isRepost = await Repost.findOne({ post, user: authId });

    if (isRepost) {
        await Repost.deleteOne({ _id: isRepost._id });
        return false;
    }

    await Repost.create({ content, post, user: authId });
    return true;
};

export const updatePostRepo = async ({
    content,
    files,
    visibility,
    tags,
    _id,
}: PostDataInterface): Promise<PostInterface | null> => {
    await findRecord(Post, { _id });

    return await Post.findByIdAndUpdate(
        _id,
        { content, files, visibility, tags },
        {
            returnDocument: "after",
            runValidators: true,
        },
    )
        .populate("user", "name.first name.last image userInfo.job")
        .lean();
};

export const likePostRepo = async (_id: string, authId: string): Promise<boolean> => {
    const post = await findRecord(Post, { _id });
    const like = await Like.findOne({ post: post._id, user: authId });
    if (like) {
        await Like.deleteOne({ _id: like._id });
        return false;
    }

    await Like.create({ post: post._id, user: authId });
    return true;
};

export const deletePostRepo = async (_id: string): Promise<void> => {
    // const session = await mongoose.startSession();

    // await session.withTransaction(async () => {
    const post = await findRecord(Post, { _id });
    await Post.deleteOne({ _id });
    await Like.deleteMany({ post: _id });
    await Comment.deleteMany({ post: _id });
    await Repost.deleteMany({ post: _id });

    if (post.files?.length) {
        await Promise.all(
            post.files.map((file) =>
                s3Client
                    .send(
                        new DeleteObjectCommand({
                            Bucket: awsConfig.s3_bucket_name,
                            Key: file.s3Key,
                        }),
                    )
                    .catch(() => {}),
            ),
        );
    }

    // });

    // await session.endSession();
};
