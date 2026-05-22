import {  Types } from "mongoose";
import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";
import { findRecord } from "../../utils/findRecord.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";

export const indexProfileRepo = async (
    query: {
        [key: string]: unknown;
    },
    limit: number,
    userId: string,
    authId: string,
) => {
    await findRecord(User, { _id: userId });

    let user = {};
    if (!query.createdAt) {
        [user] = await User.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(userId),
                },
            },

            // followers
            {
                $lookup: {
                    from: "connections",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$receiver", "$$userId"] }, { $eq: ["$status", "accepted"] }],
                                },
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],
                    as: "followers",
                },
            },

            // following
            {
                $lookup: {
                    from: "connections",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$sender", "$$userId"] }, { $eq: ["$status", "accepted"] }],
                                },
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],
                    as: "following",
                },
            },

            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    image: 1,
                    coverImage: 1,
                    job: "$userInfo.job",
                    bio: "$userInfo.bio",

                    followersCount: {
                        $ifNull: [{ $arrayElemAt: ["$followers.count", 0] }, 0],
                    },

                    followingCount: {
                        $ifNull: [{ $arrayElemAt: ["$following.count", 0] }, 0],
                    },
                },
            },
        ]);
    }

    const posts = await Post.aggregate([
        {
            $match: {
                user: new Types.ObjectId(userId),
                ...query,
            },
        },

        {
            $sort: {
                createdAt: -1,
            },
        },

        {
            $limit: limit + 1,
        },

        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "likes",
            },
        },

        {
            $lookup: {
                from: "reposts",
                localField: "_id",
                foreignField: "post",
                as: "reposts",
            },
        },

        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },

                repostsCount: {
                    $size: "$reposts",
                },

                isLiked: {
                    $in: [new Types.ObjectId(authId), "$likes.user"],
                },

                isReposted: {
                    $in: [new Types.ObjectId(authId), "$reposts.user"],
                },
            },
        },

        {
            $project: {
                content: 1,
                files: 1,
                tags: 1,
                createdAt: 1,

                likesCount: 1,
                repostsCount: 1,

                isLiked: 1,
                isReposted: 1,
            },
        },
    ]);

    return {
        user,
        posts,
    };
};

export const updateProfileRepo = async (
): Promise<void> => {
    
};

export const likeCommentRepo = async (userId: string, authId: string): Promise<void> => {
    await findRecord(Comment, { userId });
    await Like.create({ user: authId, comment: userId });
};

export const destroyCommentRepo = async (userId: string): Promise<void> => {
    await findRecord(Comment, { userId });
    await Comment.findByIdAndDelete(userId);
};
