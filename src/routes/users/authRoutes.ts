import express from "express";
import {
    forgetPassword,
    login,
    resetPassword,
    signup,
    verifyEmail,
} from '../../app/controllers/users/authController.js';
import { forgetPasswordValidator } from '../../app/validators/forgetPasswordValidator.js';
import { loginValidator } from '../../app/validators/loginValidator.js';
import { resetPasswordValidator } from '../../app/validators/resetPasswordValidator.js';
import { signupValidator } from '../../app/validators/signupValidator.js';
import { verifyEmailValidator } from '../../app/validators/verifyEmailValidator.js';

const authRouter = express.Router();

authRouter.post("/login", loginValidator, login);
authRouter.post("/signup", signupValidator, signup);
authRouter.post("/forget/password", forgetPasswordValidator, forgetPassword);
authRouter.post("/reset/password", resetPasswordValidator, resetPassword);
authRouter.post("/verify/email", verifyEmailValidator, verifyEmail);

export default authRouter;
