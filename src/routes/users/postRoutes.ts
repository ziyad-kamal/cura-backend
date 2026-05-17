import express from "express";
import { deletePost, indexPosts, likePost, repost, storePost, updatePost, updateRepost } from "../../app/controllers/users/postController.js";
import { validateId } from "../../app/middlewares/validateId.js";
import { postValidator } from "../../app/validators/postValidator.js";
import { jwtVerify } from "./../../app/middlewares/jwtVerify.js";
import { likeValidator } from "../../app/validators/likeValidator.js";
import { repostValidator } from "../../app/validators/repostValidator.js";

const postRoutes = express.Router();

postRoutes.use(jwtVerify);
postRoutes.get("", indexPosts);
postRoutes.post("/store", postValidator, storePost);
postRoutes.post("/like/:_id", likeValidator, validateId, likePost);
postRoutes.put("/update/:_id", postValidator, validateId, updatePost);
postRoutes.post("/repost/store/:_id", repostValidator, validateId, repost);
postRoutes.post("/repost/update/:_id", repostValidator, validateId, updateRepost);
postRoutes.delete("/delete/:_id/:type", validateId, deletePost);

export default postRoutes;
