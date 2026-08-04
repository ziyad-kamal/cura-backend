import { returnError, returnSuccess } from "../../../utils/returnJson.js";
import * as doctorReviewService from "../../../services/users/consultation/doctorReviewService.js";
export const store = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }
        const review = await doctorReviewService.createDoctorReview(userId, req.body);
        return returnSuccess(res, "Review submitted successfully", 201, review);
    }
    catch (error) {
        return returnError(res, error.message, 400);
    }
};
export const index = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const reviews = await doctorReviewService.getDoctorReviews(doctorId);
        return returnSuccess(res, "Reviews retrieved successfully", 200, reviews);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
export const stats = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const result = await doctorReviewService.getDoctorRatingStats(doctorId);
        return returnSuccess(res, "Rating stats retrieved successfully", 200, result);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
//# sourceMappingURL=doctorReviewController.js.map