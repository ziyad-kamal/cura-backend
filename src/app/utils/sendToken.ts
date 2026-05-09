import jwt  from "jsonwebtoken";
import { jwtConfig } from '../../config/jwt.js';
import { Response } from "express";

export const sendToken = (userData:object,res:Response):void => {
    const accessToken = jwt.sign(userData, jwtConfig.accessTokenSecret, {
        expiresIn: jwtConfig.accessExpireTime,
    });

    const refreshToken = jwt.sign(userData, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshExpireTime,
    });

    res.cookieHelper("accessToken", accessToken, 15 * 60 * 1000);
    res.cookieHelper("refreshToken", refreshToken, 24 * 60 * 60 * 1000);
};
