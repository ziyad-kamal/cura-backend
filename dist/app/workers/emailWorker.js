/* eslint-disable no-console */
import { Worker } from "bullmq";
import sendEmail from "../../config/email.js";
import { redis } from "../../config/redis.js";
export const emailWorker = new Worker("email", async (job) => {
    await sendEmail(job.data);
}, {
    connection: redis,
});
emailWorker.on("completed", (job) => {
    console.log(`✅ Email sent: ${job.id}`);
});
emailWorker.on("failed", (job, err) => {
    console.error(`❌ Email failed: ${job === null || job === void 0 ? void 0 : job.id}`, err.message);
});
//# sourceMappingURL=emailWorker.js.map