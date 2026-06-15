import express from "express";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import {
    store,
    getSeekerList,
    getDoctorList,
} from "../../../app/controllers/users/consultation/consultationController.js";

const consultationRoutes = express.Router();

consultationRoutes.post("/", jwtVerify, store);
consultationRoutes.get("/seeker", jwtVerify, getSeekerList);
consultationRoutes.get("/doctor", jwtVerify, getDoctorList);

export default consultationRoutes;
