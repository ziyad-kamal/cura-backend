import express from "express";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { upload } from "../../app/controllers/users/fileController.js";
import { uploadMulter } from "../../app/middlewares/upload.js";
import { verifyFileType } from "../../app/middlewares/verifyFileType.js";

const fileRoutes = express.Router();

fileRoutes.use(jwtVerify);
fileRoutes.post(
    "/file/upload",
    uploadMulter.single("file"),
    verifyFileType(["document", "image", "video"]),
    upload,
);

export default fileRoutes;
