import { Request, Response } from "express";

import {
    createVendorService,
    deleteVendorService,
    indexVendorsService,
    showVendorService,
    updateVendorService,
    getVendorByUserIdService,
    getVendorDashboardStatsService,
    getVendorProductsService,
    getVendorOrdersService,
    updateVendorOrderItemStatusService,
} from "../../services/vendors/vendorService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess, sendToken } from "../../utils/index.js";
import { UserRoles } from "../../../enums/UserRoles.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendors = await indexVendorsService(req);
    return returnSuccess(res, "", 200, vendors);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await createVendorService(req);
    const userData = { _id: req.user?._id, email: req.user?.email, role: UserRoles.VENDOR };
    const tokens = sendToken(userData, res);
    return returnSuccess(res, "vendor created successfully", 201, { vendor, tokens });
});

export const show = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await showVendorService(req);
    return returnSuccess(res, "", 200, { vendor });
});

export const myStore = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await getVendorByUserIdService(req);
    return returnSuccess(res, "", 200, { vendor });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await updateVendorService(req);
    return returnSuccess(res, "vendor updated successfully", 200, { vendor });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await deleteVendorService(req);
    const userData = { _id: req.user?._id, email: req.user?.email, role: UserRoles.USER };
    const tokens = sendToken(userData, res);
    return returnSuccess(res, "vendor profile deleted successfully", 200, { tokens });
});

export const dashboard = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const stats = await getVendorDashboardStatsService(req);
    return returnSuccess(res, "", 200, stats);
});

export const myProducts = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const products = await getVendorProductsService(req);
    return returnSuccess(res, "", 200, products);
});

export const myOrders = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const orders = await getVendorOrdersService(req);
    return returnSuccess(res, "", 200, orders);
});

export const updateMyOrderItemStatus = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const orderItem = await updateVendorOrderItemStatusService(req);
    return returnSuccess(res, "order item status updated successfully", 200, { orderItem });
});