import cookieParser from "cookie-parser";
import express from "express";
import { attachHelpers, errorHandler } from "./app/middlewares/index.ts";
import { appConfig, connectDB } from "./config/index.ts";
import authRoutes from "./routes/authRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(attachHelpers);

app.use(`${appConfig.apiPrefix}`, authRoutes);

app.use(`${appConfig.apiPrefix}`, postRoutes);

app.listen(appConfig.port);

app.use(errorHandler);
