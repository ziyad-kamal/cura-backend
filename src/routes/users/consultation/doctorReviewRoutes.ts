import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { store, index, stats } from "../../../app/controllers/consultation/doctorReviewController.js";

const doctorReviewRoutes = express.Router();

doctorReviewRoutes.post("/", jwtVerify, store);
doctorReviewRoutes.get("/:doctorId", index);
doctorReviewRoutes.get("/:doctorId/stats", stats);

export default doctorReviewRoutes;
