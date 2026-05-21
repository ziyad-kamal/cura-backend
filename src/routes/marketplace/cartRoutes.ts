import express from "express";

import {
    clear,
    destroy,
    index,
    store,
} from "../../app/controllers/carts/cartController.js";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.delete("/:id", destroy); 
router.delete("/", clear);

export default router;