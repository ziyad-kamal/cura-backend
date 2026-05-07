import { Response } from "express";
import { LoginRequestInterface } from "../../../interfaces/requests/LoginRequestInterface.ts";
import { SignupRequestInterface } from "../../../interfaces/requests/SignupRequestInterface.ts";
import {
    forgetPasswordService,
    loginService,
    resetPasswordService,
    signupService,
    verifyEmailService,
} from "../../services/users/authService.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { returnSuccess } from "../../utils/returnJson.ts";
import { ResetPasswordRequestInterface } from "../../../interfaces/requests/ResetPasswordRequestInterface.ts";
import { ForgetPasswordRequestInterface } from "../../../interfaces/requests/ForgetPasswordRequestInterface copy.ts";
import { VerifyEmailRequestInterface } from "../../../interfaces/requests/VerifyEmailRequestInterface.ts";

export const login = asyncHandler(async (req: LoginRequestInterface, res: Response): Promise<Response> => {
    await loginService(req, res);
    return returnSuccess(res, "Login successful", 200);
});

export const signup = asyncHandler(async (req: SignupRequestInterface, res: Response): Promise<Response> => {
    await signupService(req, res);
    return returnSuccess(res, "Your account has been created successfully", 200);
});

export const forgetPassword = asyncHandler(
    async (req: ForgetPasswordRequestInterface, res: Response): Promise<Response> => {
        await forgetPasswordService(req);
        return returnSuccess(res, "An email has been sent to reset your password", 200);
    },
);

export const resetPassword = asyncHandler(
    async (req: ResetPasswordRequestInterface, res: Response): Promise<Response> => {
        await resetPasswordService(req);
        return returnSuccess(res, "you updated password successfully", 200);
    },
);

export const verifyEmail = asyncHandler(
    async (req: VerifyEmailRequestInterface, res: Response): Promise<Response> => {
        await verifyEmailService(req);
        return returnSuccess(res, "you verified your email successfully", 200);
    },
);
