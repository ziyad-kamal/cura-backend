import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { returnError } from "../utils/returnJson.js";

export const validateId = (param: string='_id') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const value = req.params[param] as string;

        if (!Types.ObjectId.isValid(value)) {
            return returnError(res, `Invalid ${param}`, 422);
        }

        next();
    };
};
