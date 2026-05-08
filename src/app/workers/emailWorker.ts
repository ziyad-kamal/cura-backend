/* eslint-disable no-console */
import { Job, Worker } from "bullmq";
import nodemailer from "nodemailer";
import { redis } from "../../config/redis.ts";
import { EmailOptionsInterface } from "../../interfaces/config/EmailOptionsInterface.ts";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const emailWorker = new Worker<EmailOptionsInterface>(
    "email",
    async (job: Job<EmailOptionsInterface>) => {
        const options = job.data;

        const __dirname = process.cwd();

        const templatePath = path.join(__dirname, "src", "emails", `${options.templateName}.hbs`);

        const templateSource = fs.readFileSync(templatePath, "utf-8");

        const compiledTemplate = Handlebars.compile(templateSource);

        const html = compiledTemplate(options.context);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
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
    },
    { connection: redis },
);

emailWorker.on("completed", (job) => console.log(`✅ Email sent: ${job.id}`));

emailWorker.on("failed", (job, err) => console.error(`❌ Email failed: ${job?.id}`, err.message));
