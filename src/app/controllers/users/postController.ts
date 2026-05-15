import { Request, Response } from "express";
import { deletePostService, indexPostsService, likePostService, repostService, storePostService, updatePostService } from "../../services/users/postService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const indexPosts = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const posts = await indexPostsService(req);
    return returnSuccess(res, "", 200, posts);
});

export const storePost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await storePostService(req);
    return returnSuccess(res, "you created post successfully", 200, { post });
});

export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await updatePostService(req);
    return returnSuccess(res, "you updated post successfully", 200, { post });
});

export const likePost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isLike = await likePostService(req);
    return returnSuccess(res, "", 200, { isLike });
});

export const repost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isRepost = await repostService(req);
    return returnSuccess(res, "", 200, { isRepost });
});

export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await deletePostService(req);
    return returnSuccess(res, "you deleted post successfully", 200);
});
