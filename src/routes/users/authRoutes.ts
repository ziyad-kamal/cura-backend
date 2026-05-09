import express from "express";
import {
    forgetPassword,
    login,
    resetPassword,
    signup,
    verifyEmail,
} from "../../app/controllers/users/authController.ts";
import { forgetPasswordValidator } from "../../app/validators/forgetPasswordValidator.ts";
import { loginValidator } from "../../app/validators/loginValidator.ts";
import { resetPasswordValidator } from "../../app/validators/resetPasswordValidator.ts";
import { signupValidator } from "../../app/validators/signupValidator.ts";
import { verifyEmailValidator } from "../../app/validators/verifyEmailValidator.ts";

const authRouter = express.Router();

authRouter.post("/login", loginValidator, login);
authRouter.post("/signup", signupValidator, signup);
authRouter.post("/forget/password", forgetPasswordValidator, forgetPassword);
authRouter.post("/reset/password", resetPasswordValidator, resetPassword);
authRouter.post("/verify/email", verifyEmailValidator, verifyEmail);

export default authRouter;
