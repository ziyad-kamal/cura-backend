import { Queue } from "bullmq";
import { redis } from "../../config/redis.ts";
import { EmailOptionsInterface } from "../../interfaces/config/EmailOptionsInterface.ts";

export const emailQueue = new Queue<EmailOptionsInterface>("email", {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
