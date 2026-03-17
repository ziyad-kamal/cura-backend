import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.ts";
import { returnError } from "../utils/returnJson.ts";

export const jwtVerify = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
        return returnError(res, "token not found", 401);
    }

    try {
        const user = jwt.verify(accessToken as string, jwtConfig.accessTokenSecret as string) as JwtPayload;
        req.user = user;

        return next();
    } catch (error) {
        const jwtError = error as jwt.JsonWebTokenError;

        if (jwtError.name === "TokenExpiredError") {
            if (!refreshToken) {
                return returnError(res, "Session expired, please login again", 401);
            }

            try {
                const userData = jwt.verify(refreshToken, jwtConfig.refreshTokenSecret as string) as JwtPayload;

                const newAccessToken = jwt.sign(
                    { _id: userData._id, email: userData.email },
                    jwtConfig.accessTokenSecret as string,
                    {
                        expiresIn: jwtConfig.accessExpireTime,
                    } as SignOptions,
                );

                res.cookieHelper("accessToken", newAccessToken, 2 * 24 * 60 * 60 * 1000);

                req.user = userData;
                return next();
                // eslint-disable-next-line no-unused-vars
            } catch (refreshError) {
                return returnError(res, "Session expired, please login again", 401);
            }
        }

        if (jwtError.name === "JsonWebTokenError") {
            return returnError(res, "Invalid token", 401);
        }

        return returnError(res, "Something went wrong", 500);
    }
};
