import { forgetPasswordService, googleLoginService, loginService, resetPasswordService, signupService, verifyEmailService, } from "../../services/users/authService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";
export const login = asyncHandler(async (req, res) => {
    const auth = await loginService(req, res);
    return returnSuccess(res, "Login successful", 200, { auth });
});
export const googleLogin = asyncHandler(async (req, res) => {
    const auth = await googleLoginService(req, res);
    return returnSuccess(res, "Login successful", 200, { auth });
});
export const signup = asyncHandler(async (req, res) => {
    const data = await signupService(req, res);
    return returnSuccess(res, "Your account has been created successfully", 200, data);
});
export const forgetPassword = asyncHandler(async (req, res) => {
    await forgetPasswordService(req);
    return returnSuccess(res, "An email has been sent to reset your password", 200);
});
export const resetPassword = asyncHandler(async (req, res) => {
    await resetPasswordService(req);
    return returnSuccess(res, "you updated password successfully", 200);
});
export const verifyEmail = asyncHandler(async (req, res) => {
    await verifyEmailService(req);
    return returnSuccess(res, "you verified your email successfully", 200);
});
// export const logout = asyncHandler(async (req: VerifyEmailRequestInterface, res: Response): Promise<Response> => {
//     await logoutService(req);
//     return returnSuccess(res, "you verified your email successfully", 200);
// });
//# sourceMappingURL=authController.js.map