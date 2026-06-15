import { Request, Response } from "express";
import * as consultationService from "../../services/consultation/consultationService.js";
import { returnSuccess, returnError } from "../../utils/returnJson.js";

export const store = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }

        const result = await consultationService.createConsultation(userId as string, req.body);
        return returnSuccess(res, "Consultation booked successfully and chatroom created", 201, result);
    } catch (error: any) {
        return returnError(res, error.message, 400);
    }
};

export const getSeekerList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }

        const list = await consultationService.getSeekerConsultations(userId as string);
        return returnSuccess(res, "Seeker consultations retrieved", 200, list);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};

export const getDoctorList = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return returnError(res, "Unauthorized", 401);
        }

        const list = await consultationService.getDoctorConsultations(userId as string);
        return returnSuccess(res, "Doctor consultations retrieved", 200, list);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};
