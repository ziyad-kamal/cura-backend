import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { redis } from "../../../config/redis.js";
import { ForgetPasswordRequestInterface } from "../../../interfaces/requests/ForgetPasswordRequestInterface.js";
import { ResetPasswordRequestInterface } from "../../../interfaces/requests/ResetPasswordRequestInterface.js";
import { SignupRequestInterface } from "../../../interfaces/requests/SignupRequestInterface.js";
import NotFoundError from "../../errors/NotFoundError.js";
import User from "../../models/User.js";
import { loginRepo, signupRepo } from "../../repositories/users/authRepository.js";
import { findRecord, sendToken, verifyToken } from "../../utils/index.js";
import { emailQueue } from "../../queues/emailQueue.js";
import { appConfig } from "../../../config/app.js";

export const loginService = async (req: Request, res: Response): Promise<object> => {
    const { email, password } = req.body;

    const user = await loginRepo(email);
    const isMatch = await user?.comparePassword(password);
    if (!isMatch || !user) {    
        throw new NotFoundError("incorrect password or email");
    }

    const userData = { _id: user._id, email: user.contact.email };

    const tokens = sendToken(userData, res);
    return { tokens, user };
};

export const signupService = async (req: SignupRequestInterface, res: Response): Promise<object> => {
    const { firstName, lastName, email, password, role } = req.body;

    const user = await signupRepo(firstName, lastName, email, password, role);

    const userEmail = user.contact.email;
    const token = await bcrypt.hash(userEmail, 12);

    await redis.set(`verifyToken${userEmail}`, token, "EX", 5 * 60);

    await emailQueue.add("verify-email", {
        to: user.contact.email,
        subject: "verify your email",
        templateName: "verifyEmail",
        context: {
            name: user.name.first,
            verificationLink: `${appConfig.appUrl}/api/verify/email?email=${userEmail}&token=${token}`,
            app: appConfig.appName,
        },
    });

    const userData = { _id: user._id, email };

    const tokens=sendToken(userData, res);

    return { tokens ,user};
};

export const forgetPasswordService = async (req: ForgetPasswordRequestInterface): Promise<void> => {
    const { email } = req.body;
    const user = await findRecord(User, { contact: { email } });
    const userEmail = user.contact.email;
    const token = await bcrypt.hash(userEmail, 12);

    await redis.set(`resetToken${userEmail}`, token, "EX", 5 * 60);

    await emailQueue.add("forget-password", {
        to: user.contact.email,
        subject: "forget password",
        templateName: "forgetPassword",
        context: {
            name: user.name.first,
            resetPasswordLink: `${appConfig.frontendUrl}/reset/password?email=${userEmail}&token=${token}`,
            app: appConfig.appName,
        },
    });
};

export const resetPasswordService = async (req: ResetPasswordRequestInterface): Promise<void> => {
    const { email, token } = req.query;
    const { password } = req.body;
    const user = await findRecord(User, { contact: { email } }, "+password");

    verifyToken(email, token, "resetToken");

    user.password = password;
    await user.save();
};

export const verifyEmailService = async (req: ResetPasswordRequestInterface): Promise<void> => {
    const { email, token } = req.query;
    const user = await findRecord(User, { contact: { email } });

    verifyToken(email, token, "verifyToken");

    await user.updateOne({ isVerified: true });
};

export const logoutService = async (req: ResetPasswordRequestInterface): Promise<void> => {
    
};
