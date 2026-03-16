import { Request } from "express";
import { PostInterface } from "../../interfaces/models/PostInterface.ts";
import { PaginatedResponseInterface } from "../../interfaces/response/PaginatedResponseInterface.ts";
import { getAllPosts } from "../repositories/postRepository.ts";
import { getNextCursor, getQueryCursor } from "../utils/cursorPagination.ts";

const getPosts = async (req: Request): Promise<PaginatedResponseInterface<PostInterface, "posts">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor<PostInterface>(req, "createdAt");

    const posts = await getAllPosts(query, limit);

    const { hasMore, nextCursor, results } = getNextCursor<PostInterface>(posts, limit, sortField);

    return { metaData: { hasMore, nextCursor }, posts: results };
};

export { getPosts };
