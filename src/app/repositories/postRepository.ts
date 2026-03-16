import Post from "../models/Post.ts";

const getAllPosts = (
    query: {
        [key: string]: unknown;
    },
    limit: number,
) => {
    return Post.find(query)
        .select("author title content filePath")
        .populate({
            path: "comments",
            populate: {
                path: "author",
                select: "username name imagePath",
            },
            perDocumentLimit: 5,
            select: "content author createdAt",
            options: { sort: { createdAt: -1 } },
        })
        .populate("commentsCount")
        .populate("author", "username name imagePath")
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .lean();
};

export { getAllPosts };
