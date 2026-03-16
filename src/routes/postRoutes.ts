import express, { Router } from "express";
import { welcome } from "../app/controllers/loginController.ts";
import {
    getPostsController,
    storePosts,
} from "../app/controllers/postController.ts";
import { jwtVerify } from "../app/middlewares/jwtVerify.ts";
import { uploadImage } from "../app/middlewares/upload.ts";
import { verifyFileType } from "../app/middlewares/verifyFileType.ts";
import { postValidator } from "../app/validators/postValidator.ts";

const protectedRouter: Router = express.Router();

protectedRouter.use("/post", jwtVerify as never);

protectedRouter.get("/post", getPostsController);

protectedRouter.post(
    "/post/store",
    [
        uploadImage.single("image"),
        verifyFileType as never,
        postValidator as never,
    ],
    storePosts,
);

protectedRouter.get("/welcome", welcome);

export default protectedRouter;
