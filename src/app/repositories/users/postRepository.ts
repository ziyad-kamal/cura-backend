import Post from '../../models/Post.js';

export const getPostsRepo = (
    query: {
        [key: string]: unknown;
    },
    limit: number,
) => {
    return Post.find(query)
        .select("author title content filePath createdAt")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "name.first name.last image",
            },
            perDocumentLimit: 2,
            select: "content user createdAt",
            options: { sort: { createdAt: -1 } },
        })
        .populate("commentsCount")
        .populate("likesCount")
        .populate("repostsCount")
        .populate({
            path: "user",
            select: "name.first name.last image",
        })
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean();
};
