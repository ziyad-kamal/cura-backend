import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { index } from "../../../app/controllers/users/consultation/chatroomController.js";

const chatroomRoutes = express.Router();

chatroomRoutes.use(jwtVerify);
chatroomRoutes.get("", index);

export default chatroomRoutes;
