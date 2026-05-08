import { Request, Response } from "express";
import { SignupRequestInterface } from "../../../interfaces/requests/SignupRequestInterface.ts";
import NotFoundError from "../../errors/NotFoundError.ts";
import { loginRepo, signupRepo } from "../../repositories/users/authRepository.ts";
import User from "../../models/User.ts";
import bcrypt from "bcryptjs";
import { ResetPasswordRequestInterface } from "../../../interfaces/requests/ResetPasswordRequestInterface.ts";
import { ForgetPasswordRequestInterface } from "../../../interfaces/requests/ForgetPasswordRequestInterface copy.ts";
import {redis} from "../../../config/redis.ts";
import { sendToken,verifyToken ,findRecord} from "../../utils/index.ts";

export const loginService = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await loginRepo(email);
    const isMatch = await user?.comparePassword(password);
    if (!isMatch || !user) {
        throw new NotFoundError("incorrect password or email");
    }

    const userData = { _id: user._id, email: user.contact.email };

    sendToken(userData,res);
};

export const signupService = async (req: SignupRequestInterface, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, role } = req.body;

    const user = await signupRepo(firstName, lastName, email, password, role);

    const userEmail = user.contact.email;
    const token = await bcrypt.hash(userEmail, 12);

    await redis.set(`verifyToken${userEmail}`, token, "EX", 5 * 60);

    // await emailQueue.add("verify-email", {
    //     to: user.contact.email,
    //     subject: "verify your email",
    //     templateName: "verifyEmail",
    //     context: {
    //         name: user.name.first,
    //         verificationLink: `${appConfig.appUrl}/api/verify/email?email=${userEmail}&token=${token}`,
    //         app: appConfig.appName,
    //     },
    // });

    const userData = { _id: user._id, email };

    sendToken(userData, res);
};

export const forgetPasswordService = async (req: ForgetPasswordRequestInterface): Promise<void> => {
    const { email } = req.body;
    const user = await findRecord(User, { contact: { email } });
    const userEmail = user.contact.email;
    const token = await bcrypt.hash(userEmail, 12);

    await redis.set(`resetToken${userEmail}`, token, "EX", 5 * 60);

    // await emailQueue.add("forget-password", {
    //     to: user.contact.email,
    //     subject: "forget password",
    //     templateName: "forgetPassword",
    //     context: {
    //         name: user.name.first,
    //         resetPasswordLink: `${appConfig.frontendUrl}/reset/password?email=${userEmail}&token=${token}`,
    //         app: appConfig.appName,
    //     },
    // });
};

export const resetPasswordService = async (req: ResetPasswordRequestInterface): Promise<void> => {
    const { email, token } = req.query;
    const { password } = req.body;
    const user = await findRecord(User, { contact: { email } }, "+password");

    verifyToken(email, token,'resetToken');

    user.password = password;
    await user.save();
};

export const verifyEmailService = async (req: ResetPasswordRequestInterface): Promise<void> => {
    const { email, token } = req.query;
    const user = await findRecord(User, { contact: { email } });

    verifyToken(email, token,'verifyToken');

    await user.updateOne({ isVerified: true });
};
