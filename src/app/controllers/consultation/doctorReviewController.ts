import { Request, Response } from "express";
import * as doctorReviewService from "../../services/consultation/doctorReviewService.js";
import { returnSuccess, returnError } from "../../utils/returnJson.js";

export const store = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }

        const review = await doctorReviewService.createDoctorReview(userId as string, req.body);
        return returnSuccess(res, "Review submitted successfully", 201, review);
    } catch (error: any) {
        return returnError(res, error.message, 400);
    }
};

export const index = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.doctorId as string;
        const reviews = await doctorReviewService.getDoctorReviews(doctorId);
        return returnSuccess(res, "Reviews retrieved successfully", 200, reviews);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};

export const stats = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.doctorId as string;
        const result = await doctorReviewService.getDoctorRatingStats(doctorId);
        return returnSuccess(res, "Rating stats retrieved successfully", 200, result);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};
