import express from "express";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { download, upload, destroy } from "../../app/controllers/users/fileController.js";
import { fileValidator } from "../../app/validators/fileValidator.js";

const fileRoutes = express.Router();

fileRoutes.use(jwtVerify);

fileRoutes.post("/upload", fileValidator, upload);
fileRoutes.delete("/delete", destroy);
fileRoutes.post("/download", download);

export default fileRoutes;
 