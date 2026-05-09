import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { returnError } from '../utils/returnJson.js';

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    for (const param in req.params) {
        const id = req.params[param];

        if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
            return returnError(res, `Invalid ${param}`, 401);
        }
    }

    next();
};
