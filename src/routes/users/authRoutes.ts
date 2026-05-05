import express from "express";
import { login, userSignup } from "../../app/controllers/users/authController.ts";
import { loginValidator } from "../../app/validators/loginValidator.ts";
import { signupValidator } from "../../app/validators/signupValidator.ts";

const authRouter = express.Router();

authRouter.post("/login",loginValidator, login);
authRouter.post("/signup", signupValidator, userSignup);

export default authRouter;
