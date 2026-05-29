import { Response } from "express";
import { returnSuccess, returnError } from "../../utils/returnJson.js";
import {
    getCartService,
    addToCartService,
    removeFromCartService,
    clearCartService,
    syncCartService,
} from "../../services/carts/cartService.js";

export const index = async (req: any, res: Response) => {
    try {
        const cart = await getCartService(req);
        return returnSuccess(res, "Cart fetched successfully", 200, cart);
    } catch (error: any) {
        return returnError(res, error.message || "Error fetching cart", 500);
    }
};

export const sync = async (req: any, res: Response) => {
    try {
        const updatedCart = await syncCartService(req);
        return returnSuccess(res, "Cart synced successfully", 200, updatedCart);
    } catch (error: any) {
        return returnError(res, error.message || "Error syncing cart", 500);
    }
};

export const store = async (req: any, res: Response) => {
    try {
        const updatedCart = await addToCartService(req); 
        return returnSuccess(res, "Item added to cart successfully", 200, updatedCart);
    } catch (error: any) {
        return returnError(res, error.message || "Error adding item to cart", 500);
    }
};

export const destroy = async (req: any, res: Response) => {
    try {
        const updatedCart = await removeFromCartService(req);
        return returnSuccess(res, "Item removed from cart successfully", 200, updatedCart);
    } catch (error: any) {
        return returnError(res, error.message || "Error removing item from cart", 500);
    }
};

export const clear = async (req: any, res: Response) => {
    try {
        const updatedCart = await clearCartService(req);
        return returnSuccess(res, "Cart cleared successfully", 200, updatedCart);
    } catch (error: any) {
        return returnError(res, error.message || "Error clearing cart", 500);
    }
};