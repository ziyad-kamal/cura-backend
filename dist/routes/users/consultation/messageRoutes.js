import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { show } from "../../../app/controllers/users/consultation/messageController.js";
const messageRoutes = express.Router();
messageRoutes.use(jwtVerify);
messageRoutes.get("/:chatroomId", show);
export default messageRoutes;
//# sourceMappingURL=messageRoutes.js.map