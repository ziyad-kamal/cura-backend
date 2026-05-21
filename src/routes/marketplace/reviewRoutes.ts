import express from "express";

import {
    destroy,
    index,
    store,
    update,
} from "../../app/controllers/reviews/reviewController.js";

const router = express.Router();    

router.get("/", index);
router.post("/", store);
router.patch("/:id", update);
router.delete("/:id", destroy);

export default router;