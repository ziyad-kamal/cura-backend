import dotenv from "dotenv";
import Stripe from "stripe";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
/**
 * POST /payments/create-consultation-intent
 * Creates a Stripe PaymentIntent for a consultation booking.
 * Unlike the cart-based flow, this accepts an explicit amount in the request body.
 */
export const createConsultationPaymentIntent = asyncHandler(async (req, res) => {
    var _a, _b;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
    const { amount, doctorId, planType } = req.body;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            msg: "A valid consultation amount is required.",
        });
    }
    if (!doctorId || !planType) {
        return res.status(400).json({
            success: false,
            msg: "doctorId and planType are required.",
        });
    }
    // amount comes in as dollars/EGP — convert to piasters (smallest unit)
    const amountInPiasters = Math.round(Number(amount) * 100);
    if (amountInPiasters < 200) {
        return res.status(400).json({
            success: false,
            msg: "Consultation fee must be at least 2 EGP.",
        });
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPiasters,
        currency: "egp",
        metadata: {
            userId: userId.toString(),
            type: "consultation",
            doctorId: doctorId.toString(),
            planType,
        },
    });
    return returnSuccess(res, "", 200, {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: Number(amount),
    });
});
//# sourceMappingURL=createConsultationPaymentIntent.js.map