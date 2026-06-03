import express from "express";

import {
    checkRating,
    destroy,
    index,
    store,
    update,
} from "../../app/controllers/reviews/reviewController.js";
import { jwtVerify } from "../../app/middlewares/index.js";

const router = express.Router();    

router.get("/", index);
router.get("/check-rating", jwtVerify, checkRating);
router.post("/", jwtVerify, store);
router.patch("/:id", jwtVerify, update);
router.delete("/:id", jwtVerify, destroy);

export default router;