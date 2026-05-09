import express, { Router } from "express";
import { getPosts, showPost, storePosts } from '../app/controllers/postController.js';
import { jwtVerify, uploadImage, verifyFileType } from '../app/middlewares/index.js';
import { validateObjectId } from '../app/middlewares/validateObjectId.js';
import { postValidator } from '../app/validators/postValidator.js';

const protectedRouter: Router = express.Router();

protectedRouter.use("/post", jwtVerify);

protectedRouter.get("/post/show/:postId", validateObjectId, showPost);

protectedRouter.get("/post", getPosts);

protectedRouter.post("/post/store", [uploadImage.single("image"), verifyFileType, ...postValidator], storePosts);

export default protectedRouter;
