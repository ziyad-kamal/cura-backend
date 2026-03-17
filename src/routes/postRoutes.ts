import express, { Router } from "express";
import { welcome } from "../app/controllers/loginController.ts";
import { getPostsController, storePosts } from "../app/controllers/postController.ts";
import { jwtVerify, uploadImage, verifyFileType } from "../app/middlewares/index.ts";
import { postValidator } from "../app/validators/postValidator.ts";

const protectedRouter: Router = express.Router();

protectedRouter.use("/post", jwtVerify);

protectedRouter.get("/post", getPostsController);

protectedRouter.post("/post/store", [uploadImage.single("image"), verifyFileType, ...postValidator], storePosts);

protectedRouter.get("/welcome", welcome);

export default protectedRouter;
