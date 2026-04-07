import cookieParser from "cookie-parser";
import express from "express";
import { attachHelpers } from "./app/middlewares/helpers.ts";
import { rateLimiter } from "./app/middlewares/rateLimiter.ts";
import { appConfig, connectDB, connectRedis } from "./config/index.ts";
import { httpLogger } from "./config/logger.ts";
import authRoutes from "./routes/authRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";

connectDB();

const app = express();

async function bootstrap() {
    app.listen(appConfig.port);

    app.use(httpLogger);

    await connectRedis();

    app.use(rateLimiter());

    app.use(express.json());

    app.use(cookieParser());

    app.use(attachHelpers);

    app.use(`${appConfig.apiPrefix}`, authRoutes);

    app.use(`${appConfig.apiPrefix}`, postRoutes);

    // app.use(errorHandler);
}

bootstrap();
