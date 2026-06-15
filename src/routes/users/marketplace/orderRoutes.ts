import express from "express";

import {
    cancel,
    index,
    show,
    store,
    updateItemStatus,
    updateStatus,
} from "../../../app/controllers/users/marketplace/orderController.js";
import { jwtVerify, requireRole } from "../../../app/middlewares/index.js";
import { createOrderValidator, orderIdValidator } from "../../../app/validators/orderValidator.js";
import { UserRoles } from "../../../enums/UserRoles.js";

const router = express.Router();

router.get("/", jwtVerify, index);
router.post("/", jwtVerify, createOrderValidator, store);
router.get("/:id", jwtVerify, orderIdValidator, show);
router.patch("/:id/cancel", jwtVerify, orderIdValidator, cancel);
router.patch("/:id/status", jwtVerify, requireRole(UserRoles.VENDOR), orderIdValidator, updateStatus);
router.patch("/:orderId/items/:itemId/status", jwtVerify, requireRole(UserRoles.VENDOR), updateItemStatus);

export default router;
