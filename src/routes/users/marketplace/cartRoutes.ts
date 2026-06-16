import express from "express";

import { clear, destroy, index, store, sync } from "../../../app/controllers/users/marketplace/cartController.js";
import { jwtVerify } from "../../../app/middlewares/index.js";
import { storeCartValidator, syncCartValidator } from "../../../app/validators/cartValidator.js";

const router = express.Router();

router.get("/", jwtVerify, index);
router.post("/", jwtVerify, storeCartValidator, store);
router.post("/sync", jwtVerify, syncCartValidator, sync);
router.delete("/:id", jwtVerify, destroy);
router.delete("/", jwtVerify, clear);

export default router;
