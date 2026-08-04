import { checkUserRatingService, createReviewService, deleteReviewService, indexReviewsService, updateReviewService, } from "../../../services/users/marketplace/reviewService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const index = asyncHandler(async (req, res) => {
    const reviews = await indexReviewsService(req);
    return returnSuccess(res, "", 200, reviews);
});
export const checkRating = asyncHandler(async (req, res) => {
    const result = await checkUserRatingService(req);
    return returnSuccess(res, "", 200, result);
});
export const store = asyncHandler(async (req, res) => {
    const review = await createReviewService(req);
    return returnSuccess(res, "review created successfully", 201, {
        review,
    });
});
export const update = asyncHandler(async (req, res) => {
    const review = await updateReviewService(req);
    return returnSuccess(res, "review updated successfully", 200, {
        review,
    });
});
export const destroy = asyncHandler(async (req, res) => {
    await deleteReviewService(req);
    return returnSuccess(res, "review deleted successfully", 200);
});
//# sourceMappingURL=reviewController.js.map