import { Request } from "express";
import { Model } from "mongoose";
import { PostTypeInterface } from "../../../../interfaces/data/PostTypeInterface.js";
import { CommentInterface } from "../../../../interfaces/models/CommentInterface.js";
import { PostInterface } from "../../../../interfaces/models/PostInterface.js";
import { RepostInterface } from "../../../../interfaces/models/RepostInterface.js";
import { PaginationType } from "../../../../types/PaginationType.js";
import Post from "../../../models/Post.js";
import Repost from "../../../models/Repost.js";
import {
    destroyCommentRepo,
    indexCommentRepo,
    likeCommentRepo,
    storeCommentRepo,
    updateCommentRepo,
} from "../../../repositories/users/community/commentRepository.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { UserInterface } from "../../../../interfaces/models/UserInterface.js";

export const indexCommentService = async (req: Request): Promise<PaginationType<CommentInterface, "comments">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const post: PostTypeInterface =
        req.params.type === "post" ? { model: Post, key: "post" } : { model: Repost, key: "repost" };
    const comments = await indexCommentRepo(query, limit, post, req.params._id as string);

    const { hasMore, nextCursor, results } = getNextCursor(comments, limit, sortField);

    const resolvedComments = await Promise.all(
        results.map(async (comment) => {
            const user = comment.user as unknown as UserInterface;

            if (user?.image && !user.image.startsWith("http")) {
                const [image] = await resolveFiles([{ s3Key: user.image }], "public");

                user.image = image.url ?? user.image;
            }

            return comment;
        }),
    );

    return { metadata: { hasMore, nextCursor }, comments: resolvedComments };
};

export const storeCommentService = async (req: Request): Promise<CommentInterface> => {
    const post: {
        model: Model<PostInterface | RepostInterface>;
        key: string;
    } = req.params.type === "post" ? { model: Post, key: "post" } : { model: Repost, key: "repost" };

    const comment = await storeCommentRepo({ ...req.body }, req.user?._id, post, req.params._id as string);

    const user = comment.user as unknown as UserInterface;
    if (user.image) {
        const [image] = await resolveFiles([{ s3Key: user.image }], "public");

        if (image?.url) {
            user.image = image.url;
        }
    }
    return comment;
};

export const updateCommentService = async (req: Request): Promise<CommentInterface | null> => {
    return await updateCommentRepo({ ...req.body }, req.params._id as string);
};

export const likeCommentService = async (req: Request): Promise<void> => {
    return await likeCommentRepo(req.params._id as string, req.user?._id);
};

export const destroyCommentService = async (req: Request): Promise<void> => {
    return await destroyCommentRepo(req.params._id as string);
};
