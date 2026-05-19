import { Request, Response } from "express";
import { deletePostService, indexPostsService, likePostService, repostService, storePostService, updatePostService, updateRepostService } from "../../services/users/postService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const posts = await indexPostsService(req);
    return returnSuccess(res, "", 200, posts);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await storePostService(req);
    return returnSuccess(res, "you created post successfully", 200, { post });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await updatePostService(req);
    return returnSuccess(res, "you updated post successfully", 200, { post });
});

export const like = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isLike = await likePostService(req);
    return returnSuccess(res, "", 200, { isLike });
});

export const repost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isRepost = await repostService(req);
    return returnSuccess(res, "", 200, { isRepost });
});

export const updateRepost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const isRepost = await updateRepostService(req);
    return returnSuccess(res, "", 200, { isRepost });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await deletePostService(req);
    return returnSuccess(res, "you deleted post successfully", 200);
});
