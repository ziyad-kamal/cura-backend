import express from "express";
import { validateId } from "../../app/middlewares/validateId.js";
import { postValidator } from "../../app/validators/postValidator.js";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { destroy, index, store, update } from "../../app/controllers/users/commentController.js";

const commentRoutes = express.Router();

commentRoutes.use(jwtVerify);
commentRoutes.get("/:_id/:type", index);
commentRoutes.post("/store", postValidator, store);
commentRoutes.put("/update/:_id", postValidator, validateId, update);
commentRoutes.delete("/delete/:_id", validateId, destroy);

export default commentRoutes;
