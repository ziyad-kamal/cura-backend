/* eslint-disable no-console */
import "dotenv/config";
import fs from "fs";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import path from "path";
import { EmailOptionsInterface } from "../interfaces/config/EmailOptionsInterface.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("Email transporter error:", error);
    } else {
        console.log("✅ Email server is ready to send messages");
    }
});

const sendEmail = async (options: EmailOptionsInterface): Promise<void> => {
    const __dirname = process.cwd();
    const templatePath = path.join(__dirname, "..", "emails", `${options.templateName}.hps`);

    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(templateSource);

    const html = compiledTemplate(options.context);

    const mailOptions = {
        from: `${process.env.SENDER_EMAIL}`,
        to: options.to,
        subject: options.subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};

export default sendEmail;
