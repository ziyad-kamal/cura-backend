import express from "express";

import {
    destroy,
    index,
    store,
} from "../../app/controllers/wishlists/wishlistController.js";
import { jwtVerify } from "../../app/middlewares/index.js";

const router = express.Router();

router.get("/", jwtVerify, index);
router.post("/", jwtVerify, store);
router.delete("/:id", jwtVerify, destroy);

export default router;