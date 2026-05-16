import express from "express";
import { deletePost, indexPosts, likePost, repost, storePost, updatePost } from "../../app/controllers/users/postController.js";
import { validateId } from "../../app/middlewares/validateId.js";
import { postValidator } from "../../app/validators/postValidator.js";
import { jwtVerify } from "./../../app/middlewares/jwtVerify.js";
import { likeValidator } from "../../app/validators/likeValidator.js";
import { repostValidator } from "../../app/validators/repostValidator.js";

const postRoutes = express.Router();

postRoutes.use(jwtVerify);
postRoutes.get("/posts", indexPosts);
postRoutes.post("/post/store", postValidator, storePost);
postRoutes.post("/post/like/:_id", likeValidator, validateId, likePost);
postRoutes.post("/post/repost/:_id", repostValidator, validateId, repost);
postRoutes.put("/post/update/:_id", postValidator, validateId, updatePost);
postRoutes.delete("/post/delete/:_id", validateId, deletePost);

export default postRoutes;
