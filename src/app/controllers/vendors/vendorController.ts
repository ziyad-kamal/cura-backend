import { Request, Response } from "express";

import {
    createVendorService,
    deleteVendorService,
    indexVendorsService,
    showVendorService,
    updateVendorService,
} from "../../services/vendors/vendorService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendors = await indexVendorsService(req);

    return returnSuccess(res, "", 200, vendors);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await createVendorService(req);

    return returnSuccess(res, "vendor created successfully", 201, {
        vendor,
    });
});

export const show = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await showVendorService(req);

    return returnSuccess(res, "", 200, {
        vendor,
    });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const vendor = await updateVendorService(req);

    return returnSuccess(res, "vendor updated successfully", 200, {
        vendor,
    });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await deleteVendorService(req);

    return returnSuccess(res, "vendor deleted successfully", 200);
});