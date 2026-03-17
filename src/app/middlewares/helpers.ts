import { NextFunction, Request, Response } from "express";
import { cookieConfig } from "../../config/cookie.ts";

export const attachHelpers = (req: Request, res: Response, next: NextFunction): void => {
    res.cookieHelper = (name: string, value: string, maxAge: number): Response => {
        return res.cookie(name, value, cookieConfig(maxAge));
    };

    next();
};
