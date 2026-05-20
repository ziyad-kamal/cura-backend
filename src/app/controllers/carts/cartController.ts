import { Request, Response } from "express";

import {
    addToCartService,
    clearCartService,
    getCartService,
    removeFromCartService,
} from "../../services/carts/cartService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const cart = await getCartService(req);

    return returnSuccess(res, "", 200, {
        cart,
    });
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const cart = await addToCartService(req);

    return returnSuccess(res, "product added to cart", 200, {
        cart,
    });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const cart = await removeFromCartService(req);

    return returnSuccess(res, "product removed from cart", 200, {
        cart,
    });
});

export const clear = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await clearCartService(req);

    return returnSuccess(res, "cart cleared successfully", 200);
});