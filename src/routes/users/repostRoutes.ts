import express from "express";
import { like,  store,  update } from "../../app/controllers/users/repostController.js";
import { validateId} from "../../app/middlewares/validateId.js";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { authorize } from "../../app/middlewares/authorize.js";
import { repostValidator } from "../../app/validators/repostValidator.js";
import Repost from "../../app/models/Repost.js";

const repostRoutes = express.Router();

repostRoutes.use(jwtVerify);
repostRoutes.post("/store", repostValidator, store);
repostRoutes.post("/like/:_id", validateId(), like);
repostRoutes.put("/update/:_id", validateId(), repostValidator, authorize(Repost, "_id"), update);

export default repostRoutes;
