import { Request, Response } from "express";
import { loginRepo, userSignupRepo } from "../../repositories/users/authRepository.ts";
import NotFoundError from "../../errors/NotFoundError.ts";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../config/jwt.ts";
import { UserSignupRequestInterface } from "../../../interfaces/requests/UserSignupRequestInterface.ts";

const loginService = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await loginRepo(email);
    const isMatch = await user?.comparePassword(password);
    if (!isMatch || !user) {
        throw new NotFoundError("incorrect password or email");
    }

    const userData = { _id: user._id, email: user.contact.email };

    const accessToken = jwt.sign(userData, jwtConfig.accessTokenSecret, {
        expiresIn: jwtConfig.accessExpireTime,
    });

    const refreshToken = jwt.sign(userData, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshExpireTime,
    });

    res.cookieHelper("accessToken", accessToken, 2 * 24 * 60 * 60 * 1000);
    res.cookieHelper("refreshToken", refreshToken, 6 * 24 * 60 * 60 * 1000);
};

const userSignupService = async (req: UserSignupRequestInterface, res: Response): Promise<void> => {
    const { firstName, lastName, email, password ,role} = req.body;

    const user =await userSignupRepo(firstName, lastName, email, password,role);

    const userData = { _id: user._id, email };

    const accessToken = jwt.sign(userData, jwtConfig.accessTokenSecret, {
        expiresIn: jwtConfig.accessExpireTime,
    });

    const refreshToken = jwt.sign(userData, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshExpireTime,
    });

    res.cookieHelper("accessToken", accessToken,  15 * 60 * 1000);
    res.cookieHelper("refreshToken", refreshToken, 24 * 60 * 60 * 1000);
};

export { loginService, userSignupService };
