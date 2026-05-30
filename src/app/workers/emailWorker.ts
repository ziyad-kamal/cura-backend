/* eslint-disable no-console */
import { Job, Worker } from "bullmq";
import sendEmail from "../../config/email.js";
import { redis } from "../../config/redis.js";
import { EmailOptionsInterface } from "../../interfaces/config/EmailOptionsInterface.js";

export const emailWorker = new Worker<EmailOptionsInterface>(
    "email",
    async (job: Job<EmailOptionsInterface>) => {
        await sendEmail(job.data);
    },
    {
        connection: redis,
    },
);

emailWorker.on("completed", (job) => {
    console.log(`✅ Email sent: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`❌ Email failed: ${job?.id}`, err.message);
});
