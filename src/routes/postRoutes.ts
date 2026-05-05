import express, { Router } from "express";
import { getPosts, showPost, storePosts } from "../app/controllers/postController.ts";
import { jwtVerify, uploadImage, verifyFileType } from "../app/middlewares/index.ts";
import { validateObjectId } from "../app/middlewares/validateObjectId.ts";
import { postValidator } from "../app/validators/postValidator.ts";

const protectedRouter: Router = express.Router();

protectedRouter.use("/post", jwtVerify);

protectedRouter.get("/post/show/:postId", validateObjectId, showPost);

protectedRouter.get("/post", getPosts);

protectedRouter.post("/post/store", [uploadImage.single("image"), verifyFileType, ...postValidator], storePosts);

export default protectedRouter;
