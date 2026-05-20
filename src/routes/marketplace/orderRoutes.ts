import express from "express";

import {
    cancel,
    index,
    show,
    store,
} from "../../app/controllers/orders/orderController.js";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.get("/:id", show);
router.patch("/:id/cancel", cancel);

export default router;