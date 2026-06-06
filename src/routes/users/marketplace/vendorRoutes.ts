import express from "express";

import {
    destroy,
    index,
    show,
    store,
    update,
    myStore,
    dashboard,
    myProducts,
    myOrders,
    updateMyOrderItemStatus,
} from "../../../app/controllers/vendors/vendorController.js";
import { jwtVerify, requireRole } from "../../../app/middlewares/index.js";
import { UserRoles } from "../../../enums/UserRoles.js";

const router = express.Router();

// Public routes
router.get("/", index);

// Authenticated user register to become vendor
router.post("/register", jwtVerify, store);

// Protected vendor routes
router.get("/me", jwtVerify, requireRole(UserRoles.VENDOR), myStore);
router.patch("/me", jwtVerify, requireRole(UserRoles.VENDOR), update);
router.delete("/me", jwtVerify, requireRole(UserRoles.VENDOR), destroy);

router.get("/me/dashboard", jwtVerify, requireRole(UserRoles.VENDOR), dashboard);
router.get("/me/products", jwtVerify, requireRole(UserRoles.VENDOR), myProducts);
router.get("/me/orders", jwtVerify, requireRole(UserRoles.VENDOR), myOrders);
router.patch(
    "/me/orders/:orderId/items/:itemId/status",
    jwtVerify,
    requireRole(UserRoles.VENDOR),
    updateMyOrderItemStatus
);

// Public route by ID (placed at bottom to prevent parameter matching conflict)
router.get("/:id", show);

export default router;