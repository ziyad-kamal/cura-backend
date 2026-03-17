import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface JwtRequestInterface extends Request {
    user?: JwtPayload;
    cookies: {
        accessToken?: string;
        refreshToken?: string;
    };
}
