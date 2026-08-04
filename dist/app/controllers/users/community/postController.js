import { deletePostService, indexPostsService, likePostService, repostPostService, storePostService, updatePostService, } from "../../../services/users/community/postService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const index = asyncHandler(async (req, res) => {
    const posts = await indexPostsService(req);
    return returnSuccess(res, "", 200, posts);
});
export const store = asyncHandler(async (req, res) => {
    const post = await storePostService(req);
    return returnSuccess(res, "you post successfully", 200, { post });
});
export const repost = asyncHandler(async (req, res) => {
    const isRepost = await repostPostService(req);
    const msg = isRepost ? "you repost successfully" : "you unrepost successfully";
    return returnSuccess(res, msg, 200, { isRepost });
});
export const update = asyncHandler(async (req, res) => {
    const post = await updatePostService(req);
    return returnSuccess(res, "you updated post successfully", 200, { post });
});
export const like = asyncHandler(async (req, res) => {
    const isLike = await likePostService(req);
    const msg = isLike ? "you like post successfully" : "you unlike post successfully";
    return returnSuccess(res, msg, 200, { isLike });
});
export const destroy = asyncHandler(async (req, res) => {
    await deletePostService(req);
    return returnSuccess(res, "you deleted post successfully", 200);
});
//# sourceMappingURL=postController.js.map