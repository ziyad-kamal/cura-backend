import express from "express";
import { destroy, like,  store,  update } from "../../app/controllers/users/postController.js";
import { validateId } from "../../app/middlewares/validateId.js";
import { postValidator } from "../../app/validators/postValidator.js";
import { jwtVerify } from "./../../app/middlewares/jwtVerify.js";
import { authorize } from "../../app/middlewares/authorize.js";
import Post from "../../app/models/Post.js";
import { index } from "@/app/controllers/users/commentController.js";

const postRoutes = express.Router();

postRoutes.use(jwtVerify);
postRoutes.get("", index);
postRoutes.post("/store", postValidator, store);
postRoutes.post("/like/:_id", validateId(), like);
postRoutes.put("/update/:_id", validateId(), postValidator, authorize(Post, "_id"), update);
postRoutes.delete("/delete/:_id", validateId(), authorize(Post,'_id'), destroy);

export default postRoutes;
