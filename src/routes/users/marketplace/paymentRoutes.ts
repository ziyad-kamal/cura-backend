import express from "express";

import {
    createPaymentIntent,
    confirmOrder,
    handleWebhook,
} from "../../../app/controllers/payments/paymentController.js";
import { jwtVerify } from "../../../app/middlewares/index.js";

const router = express.Router();

// Protected routes (require authentication and JSON parsing)
router.post("/create-payment-intent", express.json(), jwtVerify, createPaymentIntent);
router.post("/confirm-order", express.json(), jwtVerify, confirmOrder);

// Webhook route (public - Stripe sends events here)
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
