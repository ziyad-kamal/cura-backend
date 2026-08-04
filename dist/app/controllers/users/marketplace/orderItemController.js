import { indexOrderItemsService, showOrderItemService, updateOrderItemStatusService, } from "../../../services/users/marketplace/orderItemService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const index = asyncHandler(async (req, res) => {
    const items = await indexOrderItemsService(req);
    return returnSuccess(res, "", 200, items);
});
export const show = asyncHandler(async (req, res) => {
    const item = await showOrderItemService(req);
    return returnSuccess(res, "", 200, {
        item,
    });
});
export const updateStatus = asyncHandler(async (req, res) => {
    const item = await updateOrderItemStatusService(req);
    return returnSuccess(res, "order item updated successfully", 200, {
        item,
    });
});
//# sourceMappingURL=orderItemController.js.map