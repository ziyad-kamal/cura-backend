import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.ts";
import User from "../models/User.ts";
import { returnError, returnSuccess } from "../utils/returnJson.ts";

interface CustomRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

const login = async (req: CustomRequest, res: Response): Promise<Response | void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    const isMatch = await user?.comparePassword(password);
    if (!isMatch || !user) {
        return returnError(res, "password or email is incorrect", 404);
    }

    const userData = { _id: user._id, email: user.contact.email };

    const accessToken = jwt.sign(userData, jwtConfig.accessTokenSecret, {
        expiresIn: jwtConfig.accessExpireTime,
    });

    const refreshToken = jwt.sign(userData, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshExpireTime,
    });

    res.cookieHelper("accessToken", accessToken, 2 * 24 * 60 * 60 * 1000);
    res.cookieHelper("refreshToken", refreshToken, 2 * 24 * 60 * 60 * 1000);

    return returnSuccess(res, "you login successfully", 200);
};

const welcome = async (req: Request, res: Response): Promise<Response | void> => {
    return returnSuccess(res, "welcome", 200, {});
};

export { login, welcome };
