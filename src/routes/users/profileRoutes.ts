import express from "express";
import { validateId } from "../../app/middlewares/validateId.js";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { commentValidator } from "../../app/validators/commentValidator.js";
import { authorize } from "../../app/middlewares/authorize.js";
import Comment from "../../app/models/Comment.js";
import { index ,destroy, store, update} from "../../app/controllers/users/profileController.js";

const profileRoutes = express.Router();

profileRoutes.use(jwtVerify);
profileRoutes.get("/:userId", index);
profileRoutes.post("/store", commentValidator, validateId(), store);
profileRoutes.put("/update",validateId(),authorize(Comment,'_id'), commentValidator,  update);
profileRoutes.delete("/delete", validateId(), authorize(Comment,'_id'), destroy);

export default profileRoutes;
