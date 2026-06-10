import express from "express";
import errorHandler from "./app/errors/errorHandler.js";
import { attachHelpers } from "./app/middlewares/helpers.js";
import { applyCors } from "./config/cors.js";
import { appConfig, connectDB } from "./config/index.js";
import { httpLogger } from "./config/logger.js";
import { connectRedis } from "./config/redis.js";
import fileRoutes from "./routes/users/fileRoutes.js";
import { authRoutes, postRoutes, profileRoutes, repostRoutes, commentRoutes } from "./routes/users/index.js";
import { EventEmitter } from "events";
import cartRoutes from "./routes/users/marketplace/cartRoutes.js";
import categoryRoutes from "./routes/users/marketplace/categoryRoutes.js";
import orderItemRoutes from "./routes/users/marketplace/orderItemRoutes.js";
import orderRoutes from "./routes/users/marketplace/orderRoutes.js";
import productRoutes from "./routes/users/marketplace/productRoutes.js";
import reviewRoutes from "./routes/users/marketplace/reviewRoutes.js";
import vendorRoutes from "./routes/users/marketplace/vendorRoutes.js";
import wishlistRoutes from "./routes/users/marketplace/wishlistRoutes.js";
import paymentRoutes from "./routes/users/marketplace/paymentRoutes.js";
import { createServer } from "http";
import { initSocket } from "./config/socket.js";
import chatroomRoutes from "./routes/users/consultation/chatroomRoutes.js";
import messageRoutes from "./routes/users/consultation/messageRoutes.js";
import doctorRoutes from "./routes/users/consultation/doctorRoutes.js";

const app = express();
const httpServer = createServer(app); 

async function bootstrap() {
    EventEmitter.defaultMaxListeners = 15;

    await connectDB();
    await connectRedis();

    app.use(applyCors);

    app.use(httpLogger);

    // app.use(globalLimiter);

    app.use(express.json());

    // app.use(cookieParser());

    app.use(attachHelpers);

    app.use(`${appConfig.apiPrefix}`, authRoutes);
    app.use(`${appConfig.apiPrefix}/file`, fileRoutes);
    app.use(`${appConfig.apiPrefix}/payments`, paymentRoutes);

    //community
    app.use(`${appConfig.apiPrefix}/post`, postRoutes);
    app.use(`${appConfig.apiPrefix}/repost`, repostRoutes);
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

    // consultation
    app.use(`${appConfig.apiPrefix}/chatrooms`, chatroomRoutes);
    app.use(`${appConfig.apiPrefix}/messages`, messageRoutes);
    app.use(`${appConfig.apiPrefix}/doctors`, doctorRoutes);

    app.use(errorHandler);

    initSocket(httpServer);

    httpServer.listen(appConfig.port);
}

bootstrap();
