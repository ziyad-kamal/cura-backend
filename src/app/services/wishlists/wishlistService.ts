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
        const newWishlist = await Wishlist.create({
            userId: req.user?.id,
            products: [req.body.productId],
        });
        return await newWishlist.populate("products");
    }

    if (!wishlist.products.includes(req.body.productId)) {
        wishlist.products.push(req.body.productId);
        await wishlist.save();
    }

    // إرجاع قائمة الرغبات كاملة مع تفاصيل المنتجات بعد الإضافة
    return await wishlist.populate("products");
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
    ).populate("products"); // إرجاع القائمة محدثة بعد الحذف مباشرة
};