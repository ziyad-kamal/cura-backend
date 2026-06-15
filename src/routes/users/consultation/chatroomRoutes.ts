import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { checkUsersStatus, index, endChatroom } from "../../../app/controllers/users/consultation/chatroomController.js";

const chatroomRoutes = express.Router();

chatroomRoutes.use(jwtVerify);
chatroomRoutes.get("", index);
chatroomRoutes.post("/check/users/status", checkUsersStatus);
chatroomRoutes.put("/:chatroomId/end", endChatroom);

export default chatroomRoutes;

