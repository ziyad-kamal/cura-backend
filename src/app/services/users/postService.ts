import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import { deletePostRepo, indexPostsRepo, likePostRepo, repostRepo, storePostRepo, updatePostRepo, updateRepostRepo } from "../../repositories/users/postRepository.js";
import { RepostInterface } from "../../../interfaces/models/RepostInterface.js";

export const indexPostsService = async (req: Request) => {
    const authId = req.user?._id as string;
    const cursor = req.query.cursor as string | undefined;

    const { feed, hasMore, nextCursor } = await indexPostsRepo(authId, cursor);

    return { metadata: { hasMore, nextCursor }, posts: feed };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    return await storePostRepo({ ...req.body, user: req.user?._id });
};

export const updatePostService = async (req: Request): Promise<PostInterface|null> => {
    return await updatePostRepo({ ...req.body, ...req.params });
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string,req.user?._id,req.body.type);
};

export const repostService = async (req: Request): Promise<boolean> => {
    return await repostRepo(req.params._id as string, req.user?._id, req.body.content);
};

export const updateRepostService = async (req: Request): Promise<RepostInterface | null> => {
    return await updateRepostRepo(req.params._id as string, req.user?._id, req.body.content);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
