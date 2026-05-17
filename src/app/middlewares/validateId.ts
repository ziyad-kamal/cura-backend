import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { returnError } from "../utils/returnJson.js";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    for (const param in req.params) {
        if (param === "_id") {
            const id = req.params[param] as string;

            if (!Types.ObjectId.isValid(id)) {
                return returnError(res, `Invalid ${param}`, 422);
            }
        }
    }

    next();
};
