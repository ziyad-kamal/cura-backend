import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

import Order from "../../models/Order.js";
import OrderItem from "../../models/OrderItem.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";
import { mapOrderForFrontend } from "../../services/orders/orderService.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * POST /payments/create-payment-intent
 * Creates a Stripe PaymentIntent based on the user's cart total.
 * Returns the clientSecret needed by the frontend to confirm payment.
 */
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.id || req.user?._id;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            success: false,
            msg: "Cart is empty. Add items before proceeding to payment.",
        });
    }

    // Calculate total in piasters (Stripe requires smallest currency unit)
    // EGP uses piasters: 1 EGP = 100 piasters
    const totalInPiasters = Math.round(cart.totalPrice * 100);

    if (totalInPiasters < 200) {
        // Stripe minimum for EGP is ~2 EGP
        return res.status(400).json({
            success: false,
            msg: "Order total must be at least 2 EGP.",
        });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalInPiasters,
        currency: "egp",
        metadata: {
            userId: userId.toString(),
        },
    });

    return returnSuccess(res, "", 200, {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: cart.totalPrice,
    });
});

/**
 * POST /payments/confirm-order
 * Called by frontend after successful Stripe payment confirmation.
 * Creates the order and links it to the PaymentIntent.
 */
export const confirmOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.id || req.user?._id;
    const { paymentIntentId, shippingAddress } = req.body;

    if (!paymentIntentId) {
        return res.status(400).json({
            success: false,
            msg: "Payment intent ID is required.",
        });
    }

    // Verify the payment was actually successful with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
            success: false,
            msg: `Payment not completed. Status: ${paymentIntent.status}`,
        });
    }

    // Check if order already exists for this PaymentIntent (idempotency)
    const existingOrder = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
    if (existingOrder) {
        return returnSuccess(res, "Order already created", 200, {
            order: existingOrder,
        });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            success: false,
            msg: "Cart is empty.",
        });
    }

    // Create order with paid status
    const order = await Order.create({
        userId,
        totalPrice: cart.totalPrice,
        paymentStatus: "paid",
        orderStatus: "confirmed",
        stripePaymentIntentId: paymentIntentId,
        shippingAddress,
    });

    // Create order items and decrease stock
    await Promise.all(
        cart.items.map(async (item: any) => {
            const product = await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            if (product.stock < 0) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: item.quantity } }
                );
                throw new Error(`Insufficient stock for product: ${product.title}`);
            }

            await OrderItem.create({
                orderId: order._id,
                productId: item.productId,
                vendorId: item.vendorId,
                quantity: item.quantity,
                price: item.price,
            });
        })
    );

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Fetch the complete order with items formatted for response
    const formattedOrder = await mapOrderForFrontend(order);

    return returnSuccess(res, "Order created successfully", 201, {
        order: formattedOrder,
    });
});

/**
 * POST /payments/webhook
 * Handles Stripe webhook events.
 * This is a backup mechanism - the primary order creation happens in confirmOrder.
 */
export const handleWebhook = async (req: Request, res: Response): Promise<Response> => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret as string);
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`✅ PaymentIntent ${paymentIntent.id} succeeded`);

            // Update order payment status if order exists
            const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
            if (order && order.paymentStatus !== "paid") {
                order.paymentStatus = "paid";
                await order.save();
            }
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`❌ PaymentIntent ${paymentIntent.id} failed`);

            const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
            if (order) {
                order.paymentStatus = "failed";
                await order.save();
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
};
