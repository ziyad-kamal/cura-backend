import express from "express";
import { validateId } from "../../app/middlewares/validateId.js";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { destroy, index, like, store, update } from "../../app/controllers/users/commentController.js";
import { commentValidator } from "../../app/validators/commentValidator.js";

const commentRoutes = express.Router();

commentRoutes.use(jwtVerify);
commentRoutes.get("/:_id/:type", index);
commentRoutes.post("/store/:_id/:type", commentValidator, validateId, store);
commentRoutes.post("/like/:_id", validateId, like);
commentRoutes.put("/update/:_id", commentValidator, validateId, update);
commentRoutes.delete("/delete/:_id", validateId, destroy);

export default commentRoutes;
