import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import {
    deletePostRepo,
    indexPostsRepo,
    likePostRepo,
    repostPostRepo,
    storePostRepo,
    updatePostRepo,
} from "../../repositories/users/postRepository.js";

export const indexPostsService = async (req: Request) => {
    const authId = req.user?._id as string;
    const cursor = req.query.cursor as string | undefined;

    const { feed, hasMore, nextCursor } = await indexPostsRepo(authId, cursor);

    return { metadata: { hasMore, nextCursor }, posts: feed };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    return await storePostRepo({ ...req.body, user: req.user?._id });
};

export const repostPostService = async (req: Request): Promise<boolean> => {
    return await repostPostRepo({ ...req.body }, req.user?._id);
};

export const updatePostService = async (req: Request): Promise<PostInterface | null> => {
    return await updatePostRepo({ ...req.body, ...req.params });
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
