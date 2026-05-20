import { Request } from "express";
import Cart from "../../models/Cart.js";

export const getCartService = async (req: Request) => {
    return await Cart.findOne({
       
        userId: req.user?.id,
    }).populate("items.productId");
};

export const addToCartService = async (req: Request) => {
    const cart = await Cart.findOne({
        userId: req.user?.id,
    });

    if (!cart) {
        return await Cart.create({
            userId: req.user?.id,
            items: [req.body],
        });
    }

    cart.items.push(req.body);

    await cart.save();

    return cart;
};

export const removeFromCartService = async (req: Request) => {
    return await Cart.findOneAndUpdate(
        {
            userId: req.user?.id,
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
            userId: req.user?.id,
        },
        {
            items: [],
            totalPrice: 0,
        }
    );
};