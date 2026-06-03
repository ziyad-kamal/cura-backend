import express from "express";

import {
    cancel,
    index,
    show,
    store,
    updateStatus,
    updateItemStatus,
} from "../../app/controllers/orders/orderController.js";
import { jwtVerify } from "../../app/middlewares/index.js";
import { createOrderValidator, orderIdValidator } from "../../app/validators/orderValidator.js";

const router = express.Router();

router.get("/", jwtVerify, index);
router.post("/", jwtVerify, createOrderValidator, store); 
router.get("/:id", jwtVerify, orderIdValidator, show);
router.patch("/:id/cancel", jwtVerify, orderIdValidator, cancel);
router.patch("/:id/status", jwtVerify, orderIdValidator, updateStatus);
router.patch("/:orderId/items/:itemId/status", jwtVerify, updateItemStatus);

export default router; 