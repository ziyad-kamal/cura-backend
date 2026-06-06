import express from "express";

import {
    destroy,
    index,
    show,
    store,
    update,
} from "../../../app/controllers/categories/categoryController.js";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.get("/:id", show);
router.patch("/:id", update);
router.delete("/:id", destroy);

export default router;