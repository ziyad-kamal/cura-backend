import Wishlist from "../../models/Wishlist.js";
export const getWishlistService = async (req) => {
    var _a;
    return await Wishlist.findOne({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    }).populate({
        path: "products",
        populate: {
            path: "categoryId",
        },
    });
};
export const addToWishlistService = async (req) => {
    var _a, _b;
    const wishlist = await Wishlist.findOne({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    });
    if (!wishlist) {
        const newWishlist = await Wishlist.create({
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            products: [req.body.productId],
        });
        return await newWishlist.populate({
            path: "products",
            populate: {
                path: "categoryId",
            },
        });
    }
    if (!wishlist.products.includes(req.body.productId)) {
        wishlist.products.push(req.body.productId);
        await wishlist.save();
    }
    // إرجاع قائمة الرغبات كاملة مع تفاصيل المنتجات بعد الإضافة
    return await wishlist.populate({
        path: "products",
        populate: {
            path: "categoryId",
        },
    });
};
export const removeFromWishlistService = async (req) => {
    var _a;
    return await Wishlist.findOneAndUpdate({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    }, {
        $pull: {
            products: req.params.id,
        },
    }, {
        new: true,
    }).populate({
        path: "products",
        populate: {
            path: "categoryId",
        },
    }); // إرجاع القائمة محدثة بعد الحذف مباشرة
};
//# sourceMappingURL=wishlistService.js.map