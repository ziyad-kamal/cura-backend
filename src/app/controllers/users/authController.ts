import {  Response } from "express";
import { returnSuccess } from "../../utils/returnJson.ts";
import { LoginRequestInterface } from "../../../interfaces/requests/LoginRequestInterface.ts";
import { loginService, userSignupService } from "../../services/users/authService.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { UserSignupRequestInterface } from "../../../interfaces/requests/UserSignupRequestInterface.ts";

export const login = asyncHandler(async(req: LoginRequestInterface, res: Response): Promise<Response> => {
    await loginService(req, res);
    return returnSuccess(res, "you login successfully", 200);
});

export const userSignup = asyncHandler(async (req: UserSignupRequestInterface, res: Response): Promise<Response> => {
    await userSignupService(req, res);
    return returnSuccess(res, "you signup successfully", 200);
});