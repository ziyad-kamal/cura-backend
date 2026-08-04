import { addToCartService, clearCartService, getCartService, removeFromCartService, syncCartService, } from "../../../services/users/marketplace/cartService.js";
import { returnError, returnSuccess } from "../../../utils/returnJson.js";
export const index = async (req, res) => {
    try {
        const cart = await getCartService(req);
        return returnSuccess(res, "Cart fetched successfully", 200, cart);
    }
    catch (error) {
        return returnError(res, error.message || "Error fetching cart", 500);
    }
};
export const sync = async (req, res) => {
    try {
        const updatedCart = await syncCartService(req);
        return returnSuccess(res, "Cart synced successfully", 200, updatedCart);
    }
    catch (error) {
        return returnError(res, error.message || "Error syncing cart", 500);
    }
};
export const store = async (req, res) => {
    try {
        const updatedCart = await addToCartService(req);
        return returnSuccess(res, "Item added to cart successfully", 200, updatedCart);
    }
    catch (error) {
        return returnError(res, error.message || "Error adding item to cart", 500);
    }
};
export const destroy = async (req, res) => {
    try {
        const updatedCart = await removeFromCartService(req);
        return returnSuccess(res, "Item removed from cart successfully", 200, updatedCart);
    }
    catch (error) {
        return returnError(res, error.message || "Error removing item from cart", 500);
    }
};
export const clear = async (req, res) => {
    try {
        const updatedCart = await clearCartService(req);
        return returnSuccess(res, "Cart cleared successfully", 200, updatedCart);
    }
    catch (error) {
        return returnError(res, error.message || "Error clearing cart", 500);
    }
};
//# sourceMappingURL=cartController.js.map