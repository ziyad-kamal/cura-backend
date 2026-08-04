import * as consultationService from "../../../services/users/consultation/consultationService.js";
import { returnError, returnSuccess } from "../../../utils/returnJson.js";
export const store = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }
        const result = await consultationService.createConsultation(userId, req.body);
        return returnSuccess(res, "Consultation booked successfully and chatroom created", 201, result);
    }
    catch (error) {
        return returnError(res, error.message, 400);
    }
};
export const getSeekerList = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }
        const list = await consultationService.getSeekerConsultations(userId);
        return returnSuccess(res, "Seeker consultations retrieved", 200, list);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
export const getDoctorList = async (req, res) => {
    var _a, _b;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }
        const list = await consultationService.getDoctorConsultations(userId);
        return returnSuccess(res, "Doctor consultations retrieved", 200, list);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
//# sourceMappingURL=consultationController.js.map