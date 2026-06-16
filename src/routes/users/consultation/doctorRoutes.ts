import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { index, show, store, update, destroy } from "../../../app/controllers/users/consultation/doctorController.js";

const doctorRoutes = express.Router();

doctorRoutes.get("/", index);
doctorRoutes.get("/:id", show);

doctorRoutes.post("/register", jwtVerify, store);
doctorRoutes.patch("/me", jwtVerify, update);
doctorRoutes.delete("/me", jwtVerify, destroy);

export default doctorRoutes;
 