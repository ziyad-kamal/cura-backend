import cookieParser from "cookie-parser";
import express from "express";
import errorHandler from "./app/errors/errorHandler.js";
import { attachHelpers } from "./app/middlewares/helpers.js";
import { globalLimiter } from "./app/middlewares/rateLimiter.js";
import { applyCors } from "./config/cors.js";
import { appConfig, connectDB } from "./config/index.js";
import { httpLogger } from "./config/logger.js";
import { connectRedis } from "./config/redis.js";
import { authRoutes, postRoutes } from "./routes/users/index.js";
import fileRoutes from "./routes/users/fileRoutes.js";

connectDB();

const app = express();

async function bootstrap() {
    app.listen(appConfig.port);

    app.use(applyCors);

    app.use(httpLogger);

    await connectRedis();

    app.use(globalLimiter);

    app.use(express.json());

    app.use(cookieParser());

    app.use(attachHelpers);

    app.use(`${appConfig.apiPrefix}`, authRoutes);

    app.use(`${appConfig.apiPrefix}`, postRoutes);
    app.use(`${appConfig.apiPrefix}`, fileRoutes);

    app.use(errorHandler);
}

bootstrap();
