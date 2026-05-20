import { Request, Response } from "express";

import {
    addToWishlistService,
    getWishlistService,
    removeFromWishlistService,
} from "../../services/wishlists/wishlistService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const wishlist = await getWishlistService(req);

    return returnSuccess(res, "", 200, {
        wishlist,
    });
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const wishlist = await addToWishlistService(req);

    return returnSuccess(res, "product added to wishlist", 200, {
        wishlist,
    });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const wishlist = await removeFromWishlistService(req);

    return returnSuccess(res, "product removed from wishlist", 200, {
        wishlist,
    });
});