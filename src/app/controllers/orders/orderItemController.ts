import { Request, Response } from "express";

import {
    indexOrderItemsService,
    showOrderItemService,
    updateOrderItemStatusService,
} from "../../services/orders/orderItemService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const items = await indexOrderItemsService(req);

    return returnSuccess(res, "", 200, items);
});

export const show = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const item = await showOrderItemService(req);

    return returnSuccess(res, "", 200, {
        item,
    });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const item = await updateOrderItemStatusService(req);

    return returnSuccess(res, "order item updated successfully", 200, {
        item,
    });
});