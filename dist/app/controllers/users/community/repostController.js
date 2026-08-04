import { destroyRepostService, likeRepostService, storeRepostService, updateRepostService, } from "../../../services/users/community/repostService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const store = asyncHandler(async (req, res) => {
    const isRepost = await storeRepostService(req);
    const msg = isRepost ? "you repost successfully" : "you unrepost successfully";
    return returnSuccess(res, msg, 200, { isRepost });
});
export const update = asyncHandler(async (req, res) => {
    const post = await updateRepostService(req);
    return returnSuccess(res, "you updated repost successfully", 200, { post });
});
export const like = asyncHandler(async (req, res) => {
    const isLike = await likeRepostService(req);
    const msg = isLike ? "you like repost successfully" : "you unlike repost successfully";
    return returnSuccess(res, msg, 200, { isLike });
});
export const destroy = asyncHandler(async (req, res) => {
    await destroyRepostService(req);
    return returnSuccess(res, "you deleted repost successfully", 200);
});
//# sourceMappingURL=repostController.js.map