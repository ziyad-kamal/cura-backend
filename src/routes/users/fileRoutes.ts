import express from "express";
import { jwtVerify } from "../../app/middlewares/jwtVerify.js";
import { download, upload } from "../../app/controllers/users/fileController.js";
import { uploadMulter } from "../../app/middlewares/upload.js";
import { verifyFileType } from "../../app/middlewares/verifyFileType.js";

const fileRoutes = express.Router();

fileRoutes.use(jwtVerify);
fileRoutes.post(
    "/upload",
    uploadMulter.single("file"),
    verifyFileType(["document", "image", "video"]),
    upload,
);

fileRoutes.post("/download", download);

export default fileRoutes;
