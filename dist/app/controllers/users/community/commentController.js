import { destroyCommentService, indexCommentService, likeCommentService, storeCommentService, updateCommentService, } from "../../../services/users/community/commentService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const index = asyncHandler(async (req, res) => {
    const comments = await indexCommentService(req);
    return returnSuccess(res, "", 200, comments);
});
export const store = asyncHandler(async (req, res) => {
    const comment = await storeCommentService(req);
    return returnSuccess(res, "you created comment successfully", 200, { comment });
});
export const like = asyncHandler(async (req, res) => {
    const comment = await likeCommentService(req);
    return returnSuccess(res, "you liked comment successfully", 200, { comment });
});
export const update = asyncHandler(async (req, res) => {
    const comment = await updateCommentService(req);
    return returnSuccess(res, "you updated comment successfully", 200, { comment });
});
export const destroy = asyncHandler(async (req, res) => {
    await destroyCommentService(req);
    return returnSuccess(res, "you deleted comment successfully", 200);
});
//# sourceMappingURL=commentController.js.map