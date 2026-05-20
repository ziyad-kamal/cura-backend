import express from "express";

import {
    destroy,
    index,
    store,
} from "../../app/controllers/wishlists/wishlistController.js";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.delete("/:id", destroy);

export default router;