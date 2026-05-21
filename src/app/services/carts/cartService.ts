import { Request } from "express";
import Cart from "../../models/Cart.js";

export const getCartService = async (req: Request) => {
    return await Cart.findOne({

        userId: req.user?._id,
    }).populate("items.productId");
};

export const addToCartService = async (req: Request) => {
    const { productId, vendorId, quantity, price } = req.body;
    const userId = req.user?._id; 

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        return await Cart.create({
            userId,
            items: [{ productId, vendorId, quantity, price }],
            totalPrice: quantity * price
        });
    }

    const itemIndex = cart.items.findIndex(item => item.productId?.toString() === productId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, vendorId, quantity, price });
    }
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);

    await cart.save();
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