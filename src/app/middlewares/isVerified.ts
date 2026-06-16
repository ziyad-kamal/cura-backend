import { findRecord } from "../utils/findRecord.js";
import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { returnError } from "../utils/returnJson.js";

export const isVerified = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = await findRecord(User,{_id:req.user._id});

        if (user.isVerified !== true) {
            returnError(res,'you should verify your email before doing this action',401)
        }

        next();
    };
};
