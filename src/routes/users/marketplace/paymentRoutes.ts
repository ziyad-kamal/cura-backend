import express from "express";
import { jwtVerify } from "../../../app/middlewares/index.js";
import { confirmOrder, createPaymentIntent, handleWebhook } from "../../../app/controllers/users/marketplace/paymentController.js";
import { createConsultationPaymentIntent } from "../../../app/controllers/users/marketplace/createConsultationPaymentIntent.js";

const router = express.Router();

// Protected routes (require authentication and JSON parsing)
router.post("/create-payment-intent", express.json(), jwtVerify, createPaymentIntent);
router.post("/create-consultation-intent-for-doctor", express.json(), jwtVerify, createConsultationPaymentIntent);
router.post("/confirm-order", express.json(), jwtVerify, confirmOrder);
// Webhook route (public - Stripe sends events here)
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
