import express from "express";
import { index, store } from "../../app/controllers/users/postController.js";
import { jwtVerify } from './../../app/middlewares/jwtVerify.js';

const postRoutes = express.Router();

postRoutes.use(jwtVerify);
postRoutes.get("/posts", index);
postRoutes.post("/post/store", store);

// protectedRouter.post("/post/store", [uploadImage.single("image"), verifyFileType, ...postValidator], storePosts);

export default postRoutes;
