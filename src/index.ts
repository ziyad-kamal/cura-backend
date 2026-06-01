import express from "express";

import errorHandler from "./app/errors/errorHandler.js";

//community
import { attachHelpers } from "./app/middlewares/helpers.js";
import { globalLimiter } from "./app/middlewares/rateLimiter.js";
import { applyCors } from "./config/cors.js";
import { appConfig, connectDB } from "./config/index.js";
import { httpLogger } from "./config/logger.js";
import { connectRedis } from "./config/redis.js";
import fileRoutes from "./routes/users/fileRoutes.js";
import { authRoutes, postRoutes ,profileRoutes,repostRoutes,commentRoutes} from "./routes/users/index.js";

// marketplace
import { EventEmitter } from "events";
import cartRoutes from "./routes/marketplace/cartRoutes.js";
import categoryRoutes from "./routes/marketplace/categoryRoutes.js";
import orderItemRoutes from "./routes/marketplace/orderItemRoutes.js";
import orderRoutes from "./routes/marketplace/orderRoutes.js";
import productRoutes from "./routes/marketplace/productRoutes.js";
import reviewRoutes from "./routes/marketplace/reviewRoutes.js";
import vendorRoutes from "./routes/marketplace/vendorRoutes.js";
import wishlistRoutes from "./routes/marketplace/wishlistRoutes.js";


const app = express();

async function bootstrap() {
    app.listen(appConfig.port);

    EventEmitter.defaultMaxListeners = 15;

    await connectDB();
    await connectRedis();

    app.use(applyCors);

    app.use(httpLogger);

    app.use(globalLimiter);

    app.use(express.json());

    // app.use(cookieParser());

    app.use(attachHelpers);

    //community
    app.use(`${appConfig.apiPrefix}`, authRoutes);
    app.use(`${appConfig.apiPrefix}/post`, postRoutes);
    app.use(`${appConfig.apiPrefix}/repost`, repostRoutes);
    app.use(`${appConfig.apiPrefix}/file`, fileRoutes);
    app.use(`${appConfig.apiPrefix}/comment`, commentRoutes);
    app.use(`${appConfig.apiPrefix}/profile`, profileRoutes);

    // marketplace
    app.use(`${appConfig.apiPrefix}/vendors`, vendorRoutes);
    app.use(`${appConfig.apiPrefix}/categories`, categoryRoutes);
    app.use(`${appConfig.apiPrefix}/products`, productRoutes);
    app.use(`${appConfig.apiPrefix}/wishlists`, wishlistRoutes);
    app.use(`${appConfig.apiPrefix}/carts`, cartRoutes);
    app.use(`${appConfig.apiPrefix}/orders`, orderRoutes);
    app.use(`${appConfig.apiPrefix}/order-items`, orderItemRoutes);
    app.use(`${appConfig.apiPrefix}/reviews`, reviewRoutes);

    app.use(errorHandler);
}

bootstrap();
