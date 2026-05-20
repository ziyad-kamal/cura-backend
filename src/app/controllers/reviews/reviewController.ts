import { Request, Response } from "express";

import {
    createReviewService,
    deleteReviewService,
    indexReviewsService,
    updateReviewService,
} from "../../services/reviews/reviewService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const reviews = await indexReviewsService(req);

    return returnSuccess(res, "", 200, reviews);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const review = await createReviewService(req);

    return returnSuccess(res, "review created successfully", 201, {
        review,
    });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const review = await updateReviewService(req);

    return returnSuccess(res, "review updated successfully", 200, {
        review,
    });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await deleteReviewService(req);

    return returnSuccess(res, "review deleted successfully", 200);
});