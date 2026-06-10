import { Request } from "express";
import { PostInterface } from "../../../../interfaces/models/PostInterface.js";
import {
    deletePostRepo,
    indexPostsRepo,
    likePostRepo,
    repostPostRepo,
    storePostRepo,
    updatePostRepo,
} from "../../../repositories/users/community/postRepository.js";
import { handleS3Files } from "../../../utils/handleS3Files.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";

export const indexPostsService = async (req: Request) => {
    const authId = req.user?._id as string;
    const cursor = req.query.cursor as string | undefined;

    const { feed, hasMore, nextCursor } = await indexPostsRepo(authId, cursor);

    return { metadata: { hasMore, nextCursor }, posts: feed };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    const { files, visibility } = req.body;

    let updatedFiles = await handleS3Files(files, "public/posts/");

    const post = await storePostRepo({ ...req.body, files: updatedFiles, user: req.user?._id });

    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, visibility);
        return { ...post, files: resolvedFiles } as PostInterface;
    }

    return post;
};

export const repostPostService = async (req: Request): Promise<boolean> => {
    return await repostPostRepo({ ...req.body }, req.user?._id);
};

export const updatePostService = async (req: Request): Promise<PostInterface | null> => {
    const { files, visibility } = req.body;

    let updatedFiles = await handleS3Files(files, "public/posts/");

    const post = await updatePostRepo({ ...req.body, files: updatedFiles, ...req.params });

    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, visibility);
        return { ...post, files: resolvedFiles } as PostInterface;
    }

    return post;
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
