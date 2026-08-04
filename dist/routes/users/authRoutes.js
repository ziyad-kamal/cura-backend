import express from "express";
import { forgetPassword, googleLogin, login, resetPassword, signup, verifyEmail, } from "../../app/controllers/users/authController.js";
import { forgetPasswordValidator } from "../../app/validators/forgetPasswordValidator.js";
import { loginValidator } from "../../app/validators/loginValidator.js";
import { resetPasswordValidator } from "../../app/validators/resetPasswordValidator.js";
import { signupValidator } from "../../app/validators/signupValidator.js";
import { verifyEmailValidator } from "../../app/validators/verifyEmailValidator.js";
const authRoutes = express.Router();
authRoutes.post("/login", loginValidator, login);
authRoutes.post("/google/login", googleLogin);
authRoutes.post("/signup", signupValidator, signup);
authRoutes.post("/forget/password", forgetPasswordValidator, forgetPassword);
authRoutes.post("/reset/password", resetPasswordValidator, resetPassword);
authRoutes.get("/verify/email", verifyEmailValidator, verifyEmail);
export default authRoutes;
//# sourceMappingURL=authRoutes.js.map