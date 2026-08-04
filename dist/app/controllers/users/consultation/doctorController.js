import * as doctorService from "../../../services/users/consultation/doctorService.js";
import { returnError, returnSuccess } from "../../../utils/returnJson.js";
import User from "../../../models/User.js";
export const index = async (req, res) => {
    try {
        const doctors = await doctorService.findAllDoctors();
        return returnSuccess(res, "Doctors retrieved successfully", 200, doctors);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
export const show = async (req, res) => {
    try {
        const doctor = await doctorService.findDoctorById(req.params.id);
        if (!doctor) {
            return returnError(res, "Doctor not found", 404);
        }
        return returnSuccess(res, "Doctor details retrieved", 200, doctor);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
export const store = async (req, res) => {
    var _a, _b, _c;
    try {
        const existingUser = await User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.role) === "doctor" && ((_b = existingUser === null || existingUser === void 0 ? void 0 : existingUser.doctorInfo) === null || _b === void 0 ? void 0 : _b.specialization)) {
            return returnError(res, "You are already registered as a doctor", 400);
        }
        const doctor = await doctorService.registerAsDoctor((_c = req.user) === null || _c === void 0 ? void 0 : _c._id, req.body);
        return returnSuccess(res, "Doctor profile created successfully", 201, doctor);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
export const update = async (req, res) => {
    var _a;
    try {
        const doctor = await doctorService.updateDoctorData((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.body);
        if (!doctor) {
            return returnError(res, "Doctor profile not found", 404);
        }
        return returnSuccess(res, "Doctor profile updated", 200, doctor);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
export const destroy = async (req, res) => {
    var _a;
    try {
        const doctor = await doctorService.removeDoctorRole((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!doctor) {
            return returnError(res, "Doctor profile not found", 404);
        }
        return returnSuccess(res, "Doctor profile deleted successfully", 200);
    }
    catch (error) {
        return returnError(res, error.message, 500);
    }
};
//# sourceMappingURL=doctorController.js.map