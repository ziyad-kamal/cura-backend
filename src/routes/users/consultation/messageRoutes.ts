import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";

const messageRoutes = express.Router();

messageRoutes.use(jwtVerify);
// messageRoutes.get("/:chatroomId", index);

export default messageRoutes;
