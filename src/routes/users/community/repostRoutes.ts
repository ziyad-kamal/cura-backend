import express from "express";
import { destroy, like, store, update } from "../../../app/controllers/users/community/repostController.js";
import { authorize } from "../../../app/middlewares/authorize.js";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { validateId } from "../../../app/middlewares/validateId.js";
import Repost from "../../../app/models/Repost.js";
import { repostValidator } from "../../../app/validators/repostValidator.js";

const repostRoutes = express.Router();

repostRoutes.use(jwtVerify);
repostRoutes.post("/store/:_id", repostValidator, store);
repostRoutes.post("/like/:_id", validateId(), like);
repostRoutes.put("/update/:_id", validateId(), authorize(Repost, "_id"), repostValidator, update);
repostRoutes.delete("/delete/:_id", validateId(), authorize(Repost, "_id"), destroy);

export default repostRoutes;
