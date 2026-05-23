import { Request, Response } from "express";

import {
    createProductService,
    deleteProductService,
    indexProductsService,
    showProductService,
    updateProductService,
} from "../../services/products/productService.js";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const products = await indexProductsService(req);

    return returnSuccess(res, "", 200, products);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const product = await createProductService(req);

    return returnSuccess(res, "product created successfully", 201, {
        product,
    });
});

export const show = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const product = await showProductService(req);

    return returnSuccess(res, "", 200, {
        product,
    });
});

export const update = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const product = await updateProductService(req);
    
    return returnSuccess(res, "product updated successfully", 200, {
        product,
    });
});

export const destroy = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await deleteProductService(req);

    return returnSuccess(res, "product deleted successfully", 200);
});