import { Response } from "express";
import { ForgetPasswordRequestInterface } from "../../../interfaces/requests/ForgetPasswordRequestInterface.js";
import { LoginRequestInterface } from "../../../interfaces/requests/LoginRequestInterface.js";
import { ResetPasswordRequestInterface } from "../../../interfaces/requests/ResetPasswordRequestInterface.js";
import { SignupRequestInterface } from "../../../interfaces/requests/SignupRequestInterface.js";
import { VerifyEmailRequestInterface } from "../../../interfaces/requests/VerifyEmailRequestInterface.js";
import {
    forgetPasswordService,
    loginService,
    resetPasswordService,
    signupService,
    verifyEmailService,
} from "../../services/users/authService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const login = asyncHandler(async (req: LoginRequestInterface, res: Response): Promise<Response> => {
    const auth = await loginService(req, res);
    return returnSuccess(res, "Login successful", 200, { auth });
});

export const signup = asyncHandler(async (req: SignupRequestInterface, res: Response): Promise<Response> => {
    const data = await signupService(req, res);
    return returnSuccess(res, "Your account has been created successfully", 200, data);
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

export const verifyEmail = asyncHandler(async (req: VerifyEmailRequestInterface, res: Response): Promise<Response> => {
    await verifyEmailService(req);
    return returnSuccess(res, "you verified your email successfully", 200);
});

// export const logout = asyncHandler(async (req: VerifyEmailRequestInterface, res: Response): Promise<Response> => {
//     await logoutService(req);
//     return returnSuccess(res, "you verified your email successfully", 200);
// });
