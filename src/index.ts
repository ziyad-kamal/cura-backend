import cookieParser from "cookie-parser";
import express from "express";
import { attachHelpers } from "./app/middlewares/helpers.ts";
import { globalLimiter } from "./app/middlewares/rateLimiter.ts";
import { appConfig, connectDB } from "./config/index.ts";
import { httpLogger } from "./config/logger.ts";
import postRoutes from "./routes/postRoutes.ts";
import errorHandler from "./app/errors/errorHandler.ts";
import authRouter from "./routes/users/authRoutes.ts";
import { connectRedis } from "./config/redis.ts";
import { applyCors } from "./config/cors.ts";

connectDB();

const app = express();

async function bootstrap() {
    app.listen(appConfig.port);

    app.use(applyCors)

    app.use(httpLogger);

    await connectRedis();

    app.use(globalLimiter);

    app.use(express.json());

    app.use(cookieParser());

    app.use(attachHelpers);

    app.use(`${appConfig.apiPrefix}`, authRouter);

    app.use(`${appConfig.apiPrefix}`, postRoutes);

    app.use(errorHandler);
}

bootstrap();
