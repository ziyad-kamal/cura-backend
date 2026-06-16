/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as doctorService from "../../../services/users/consultation/doctorService.js";
import { returnError, returnSuccess } from "../../../utils/returnJson.js";
import User from "../../../models/User.js";

export const index = async (req: Request, res: Response) => {
    try {
        const doctors = await doctorService.findAllDoctors();
        return returnSuccess(res, "Doctors retrieved successfully", 200, doctors);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const doctor = await doctorService.findDoctorById(req.params.id as string);
        if (!doctor) {
            return returnError(res, "Doctor not found", 404);
        }
        return returnSuccess(res, "Doctor details retrieved", 200, doctor);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};

export const store = async (req: Request, res: Response) => {
    try {
        const existingUser = await User.findById(req.user?._id);
        if (existingUser?.role === "doctor" && existingUser?.doctorInfo?.specialization) {
            return returnError(res, "You are already registered as a doctor", 400);
        }

        const doctor = await doctorService.registerAsDoctor(req.user?._id as any, req.body);
        return returnSuccess(res, "Doctor profile created successfully", 201, doctor);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const doctor = await doctorService.updateDoctorData(req.user?._id as any, req.body);
        if (!doctor) {
            return returnError(res, "Doctor profile not found", 404);
        }
        return returnSuccess(res, "Doctor profile updated", 200, doctor);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        const doctor = await doctorService.removeDoctorRole(req.user?._id as any);
        
        if (!doctor) {
            return returnError(res, "Doctor profile not found", 404);
        }

        return returnSuccess(res, "Doctor profile deleted successfully", 200);
    } catch (error: any) {
        return returnError(res, error.message, 500);
    }
};