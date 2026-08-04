import { Types } from "mongoose";
import Connection from "../../../models/Connection.js";
import Post from "../../../models/Post.js";
import User from "../../../models/User.js";
import { findRecord } from "../../../utils/findRecord.js";
import RecordExistError from "../../../errors/RecordExistError.js";
export const indexProfileRepo = async (query, limit, userId, authId) => {
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
            // connection status
            {
                $lookup: {
                    from: "connections",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ["$sender", "$$userId"] },
                                                { $eq: ["$receiver", new Types.ObjectId(authId)] },
                                            ],
                                        },
                                        {
                                            $and: [
                                                { $eq: ["$receiver", "$$userId"] },
                                                { $eq: ["$sender", new Types.ObjectId(authId)] },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1, // Already projected here! Correct.
                                status: 1,
                                sender: 1,
                            },
                        },
                    ],
                    as: "connectionMeta",
                },
            },
            {
                $project: {
                    firstName: "$name.first",
                    lastName: "$name.last",
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
                    // 1. EXTRACT CONNECTION ID (Returns string Id or null if no connection exists)
                    connectionId: {
                        $ifNull: [{ $arrayElemAt: ["$connectionMeta._id", 0] }, null],
                    },
                    // "pending" | "accepted" | "rejected" | null
                    connectionStatus: {
                        $ifNull: [{ $arrayElemAt: ["$connectionMeta.status", 0] }, null],
                    },
                    // tells frontend if auth user is the sender (to show "cancel request" vs "accept")
                    isConnectionSender: {
                        $eq: [{ $arrayElemAt: ["$connectionMeta.sender", 0] }, new Types.ObjectId(authId)],
                    },
                },
            },
        ]);
    }
    const posts = await Post.aggregate([
        {
            $match: Object.assign({ user: new Types.ObjectId(userId) }, query),
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
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
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
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" },
                repostsCount: { $size: "$reposts" },
                isLiked: { $in: [new Types.ObjectId(authId), "$likes.user"] },
                isReposted: { $in: [new Types.ObjectId(authId), "$reposts.user"] },
            },
        },
        {
            $project: {
                content: 1,
                files: 1,
                tags: 1,
                visibility: 1,
                user: 1,
                createdAt: 1,
                likesCount: 1,
                commentsCount: 1,
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
export const getConnectionsProfileRepo = async (authId) => {
    return await Connection.find({ receiver: authId, status: 'pending' })
        .select('sender')
        .populate('sender', 'name.first name.last image userInfo.job')
        .lean();
};
export const updateProfileRepo = async (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
data, authId) => {
    await findRecord(User, { _id: authId });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields = {};
    if (data.bio !== undefined)
        updateFields["userInfo.bio"] = data.bio;
    if (data.job !== undefined)
        updateFields["userInfo.job"] = data.job;
    if (data.firstName !== undefined)
        updateFields["name.first"] = data.firstName;
    if (data.lastName !== undefined)
        updateFields["name.last"] = data.lastName;
    if (data.image !== undefined)
        updateFields.image = data.image;
    if (data.coverImage !== undefined)
        updateFields.coverImage = data.coverImage;
    // Seeker profile fields
    if (data.phone !== undefined)
        updateFields["contact.phone"] = data.phone;
    if (data.city !== undefined)
        updateFields["contact.address.city"] = data.city;
    if (data.street !== undefined)
        updateFields["contact.address.street"] = data.street;
    if (data.age !== undefined)
        updateFields["userInfo.age"] = data.age;
    if (data.weight !== undefined)
        updateFields["userInfo.weight"] = data.weight;
    if (data.height !== undefined)
        updateFields["userInfo.height"] = data.height;
    if (data.gender !== undefined)
        updateFields["userInfo.gender"] = data.gender;
    if (data.diseases !== undefined)
        updateFields["userInfo.diseases"] = data.diseases;
    if (data.medications !== undefined)
        updateFields["userInfo.medications"] = data.medications;
    return await User.findByIdAndUpdate(authId, { $set: updateFields }, { returnDocument: "after" }).lean();
};
export const connectProfileRepo = async (_id, authId) => {
    await findRecord(User, { _id });
    const connection = await Connection.findOne({ $or: [{ sender: authId, receiver: _id }, { receiver: authId, sender: _id }] });
    if (connection) {
        throw new RecordExistError('you already connected with this user');
    }
    await Connection.create({
        sender: authId,
        receiver: _id,
    });
};
export const acceptProfileRepo = async (_id) => {
    await Connection.findOneAndUpdate({
        _id,
    }, {
        status: "accepted",
    });
};
export const ignoreProfileRepo = async (_id) => {
    await Connection.findOneAndUpdate({
        _id,
    }, {
        status: "ignored",
    });
};
export const cancelProfileRepo = async (_id) => {
    await Connection.deleteOne({
        _id
    });
};
//# sourceMappingURL=profileRepository.js.map