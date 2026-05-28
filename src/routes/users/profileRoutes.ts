import express from "express";
import { validateId } from "../../app/middlewares/validateId.js";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { authorize } from "../../app/middlewares/authorize.js";
import { connect, index , update} from "../../app/controllers/users/profileController.js";
import User from "../../app/models/User.js";
import { profileValidator } from "../../app/validators/profileValidator.js";

const profileRoutes = express.Router();

profileRoutes.use(jwtVerify);
profileRoutes.get("/:userId",validateId('userId') ,index);
profileRoutes.put("/update/:userId", validateId('userId'), authorize(User, "userId",'_id'), profileValidator, update);
profileRoutes.post("/connect/:userId", validateId("userId"), connect);
// profileRoutes.put("/accept/:userId", validateId("userId"), accept);
// profileRoutes.put("/ignore/:userId", validateId("userId"), ignore);

export default profileRoutes;
