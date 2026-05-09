import cookieParser from "cookie-parser";
import express from "express";
import { attachHelpers } from './app/middlewares/helpers.js';
import { globalLimiter } from './app/middlewares/rateLimiter.js';
import { appConfig, connectDB } from './config/index.js';
import { httpLogger } from './config/logger.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './app/errors/errorHandler.js';
import authRouter from './routes/users/authRoutes.js';
import { connectRedis } from './config/redis.js';
import { applyCors } from './config/cors.js';

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
