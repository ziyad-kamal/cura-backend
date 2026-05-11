import { Request } from "express";
import { PostInterface } from "../../interfaces/models/PostInterface.js";
import { PaginationType } from "../../types/PaginationType.js";
import { indexPostsRepo } from "../repositories/postRepository.js";
import { getNextCursor, getQueryCursor } from "../utils/cursorPagination.js";

const indexPostsService = async (req: Request): Promise<PaginationType<PostInterface, "posts">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const posts = await indexPostsRepo(query, limit);

    const { hasMore, nextCursor, results } = getNextCursor(posts, limit, sortField);

    return { metadata: { hasMore, nextCursor }, posts: results };
};

export { indexPostsService };
