import { Request, Response } from "express";

import {
    cancelOrderService,
    createOrderService,
    indexOrdersService,
    showOrderService,
} from "../../services/orders/orderService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const orders = await indexOrdersService(req);

    return returnSuccess(res, "", 200, orders);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const order = await createOrderService(req);

    return returnSuccess(res, "order created successfully", 201, {
        order,
    });
});

export const show = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const order = await showOrderService(req);

    return returnSuccess(res, "", 200, {
        order,
    });
});

export const cancel = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const order = await cancelOrderService(req);

    return returnSuccess(res, "order cancelled successfully", 200, {
        order,
    });
});