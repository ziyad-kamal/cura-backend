import { Request } from "express";
import Cart from "../../models/Cart.js";

export const getCartService = async (req: Request) => {
    const userId = req.user?._id;

    if (!userId) {
        return null;
    }

    return await Cart.findOne({ userId }).populate("items.productId");
};

export const addToCartService = async (req: Request) => {
    const { productId, vendorId, quantity, price, userId } = req.body;

    const finalUserId = userId || req.user?._id;

    if (!finalUserId) {
        throw new Error("User ID required");
    }

    let cart = await Cart.findOne({ userId: finalUserId });

    if (!cart) {
        cart = await Cart.create({
            userId: finalUserId,
            items: [{ productId, vendorId, quantity, price }],
            totalPrice: quantity * price
        });
    } else {
        const itemIndex = cart.items.findIndex(item => item.productId?.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, vendorId, quantity, price });
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
        await cart.save();
    }
    return cart;
};

export const removeFromCartService = async (req: Request) => {
    return await Cart.findOneAndUpdate(
        {
            userId: req.user?._id,
        },
        {
            $pull: {
                items: {
                    _id: req.params.id,
                },
            },
        },
        {
            new: true,
        }
    );
};

export const clearCartService = async (req: Request) => {
    return await Cart.findOneAndUpdate(
        {
            userId: req.user?._id,
        },
        {
            items: [],
            totalPrice: 0,
        }
    );
};