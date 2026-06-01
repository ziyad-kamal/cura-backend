import express from "express";
import { destroy, index, like, store, update } from "../../../app/controllers/users/community/commentController.js";
import { authorize } from "../../../app/middlewares/authorize.js";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { validateId } from "../../../app/middlewares/validateId.js";
import Comment from "../../../app/models/Comment.js";
import { commentValidator } from "../../../app/validators/commentValidator.js";

const commentRoutes = express.Router();

commentRoutes.use(jwtVerify);
commentRoutes.get("/:_id/:type", index);
commentRoutes.post("/store/:_id/:type", commentValidator, validateId(), store);
commentRoutes.post("/like/:_id", validateId(), like);
commentRoutes.put("/update/:_id", validateId(), authorize(Comment, "_id"), commentValidator, update);
commentRoutes.delete("/delete/:_id", validateId(), authorize(Comment, "_id"), destroy);

export default commentRoutes;
