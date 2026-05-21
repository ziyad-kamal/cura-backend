import { Request } from "express";
import Wishlist from "../../models/Wishlist.js";

export const getWishlistService = async (req: Request) => {
    return await Wishlist.findOne({
        userId: req.user?.id,
    }).populate("products");
};

export const addToWishlistService = async (req: Request) => {
    const wishlist = await Wishlist.findOne({
        userId: req.user?.id,
    });

    if (!wishlist) {
        return await Wishlist.create({
            userId: req.user?.id,
            products: [req.body.productId],
        });
    }

    if (!wishlist.products.includes(req.body.productId)) {
        wishlist.products.push(req.body.productId);
        await wishlist.save();
    }

    return wishlist;
};

export const removeFromWishlistService = async (req: Request) => {
    return await Wishlist.findOneAndUpdate(
        {
            userId: req.user?.id,
        },
        {
            $pull: {
                products: req.params.id,
            },
        },
        {
            new: true,
        }
    );
};