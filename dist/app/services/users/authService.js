import bcrypt from "bcryptjs";
import { redis } from "../../../config/redis.js";
import NotFoundError from "../../errors/NotFoundError.js";
import User from "../../models/User.js";
import { googleLoginRepo, loginRepo, signupRepo } from "../../repositories/users/authRepository.js";
import { findRecord, sendToken, verifyToken } from "../../utils/index.js";
import { emailQueue } from "../../queues/emailQueue.js";
import { appConfig } from "../../../config/app.js";
import { verifyGoogleToken } from "../../../config/googleAuth.js";
import { resolveFiles } from "../../utils/resolveFiles.js";
export const loginService = async (req, res) => {
    const { email, password } = req.body;
    const user = await loginRepo(email);
    const isMatch = await (user === null || user === void 0 ? void 0 : user.comparePassword(password));
    if (!isMatch || !user) {
        throw new NotFoundError("incorrect password or email");
    }
    if (user) {
        const filesToResolve = [];
        if (user.image)
            filesToResolve.push({ type: "image", s3Key: user.image });
        if (user.coverImage)
            filesToResolve.push({ type: "coverImage", s3Key: user.coverImage });
        const resolvedFiles = await resolveFiles(filesToResolve, "public");
        resolvedFiles.forEach((file) => {
            if (file.type === "image")
                user.image = file.url;
            if (file.type === "coverImage")
                user.coverImage = file.url;
        });
    }
    const userData = { _id: user._id, email: user.contact.email, role: user.role };
    const tokens = sendToken(userData, res);
    return { tokens, user };
};
export const googleLoginService = async (req, res) => {
    var _a;
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
    if (!(payload === null || payload === void 0 ? void 0 : payload.email)) {
        throw new NotFoundError('email not found');
    }
    const user = await googleLoginRepo({
        email: payload.email,
        given_name: payload.given_name || "",
        family_name: payload.family_name || "",
    });
    const tokens = sendToken({
        _id: user === null || user === void 0 ? void 0 : user._id,
        email: user === null || user === void 0 ? void 0 : user.contact.email,
        role: (_a = user === null || user === void 0 ? void 0 : user.role) !== null && _a !== void 0 ? _a : "user",
    }, res);
    return { tokens, user };
};
export const signupService = async (req, res) => {
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
            verificationLink: `${appConfig.frontendUrl}/verify-email?email=${userEmail}&token=${token}`,
            app: appConfig.appName,
        },
    });
    const userData = { _id: user._id, email, role: user.role };
    const tokens = sendToken(userData, res);
    return { tokens, user };
};
export const forgetPasswordService = async (req) => {
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
export const resetPasswordService = async (req) => {
    const { email, token } = req.query;
    const { password } = req.body;
    const user = await findRecord(User, { contact: { email } }, "+password");
    verifyToken(email, token, "resetToken");
    await redis.del(`resetToken${email}`);
    user.password = password;
    await user.save();
};
export const verifyEmailService = async (req) => {
    const { email, token } = req.query;
    const user = await findRecord(User, { contact: { email } });
    verifyToken(email, token, "verifyToken");
    await user.updateOne({ isVerified: true });
};
export const logoutService = async (req) => { };
//# sourceMappingURL=authService.js.map