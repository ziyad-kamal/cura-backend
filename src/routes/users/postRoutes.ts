import express from "express";
import { get } from "../../app/controllers/users/postController.js";

const postRoutes = express.Router();

postRoutes.get("/posts", get);

export default postRoutes;
