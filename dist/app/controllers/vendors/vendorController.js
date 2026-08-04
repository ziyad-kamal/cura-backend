import { createVendorService, deleteVendorService, indexVendorsService, showVendorService, updateVendorService, getVendorByUserIdService, getVendorDashboardStatsService, getVendorProductsService, getVendorOrdersService, updateVendorOrderItemStatusService, } from "../../services/vendors/vendorService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess, sendToken } from "../../utils/index.js";
import { UserRoles } from "../../../enums/UserRoles.js";
export const index = asyncHandler(async (req, res) => {
    const vendors = await indexVendorsService(req);
    return returnSuccess(res, "", 200, vendors);
});
export const store = asyncHandler(async (req, res) => {
    var _a, _b;
    const vendor = await createVendorService(req);
    const userData = { _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email, role: UserRoles.VENDOR };
    const tokens = sendToken(userData, res);
    return returnSuccess(res, "vendor created successfully", 201, { vendor, tokens });
});
export const show = asyncHandler(async (req, res) => {
    const vendor = await showVendorService(req);
    return returnSuccess(res, "", 200, { vendor });
});
export const myStore = asyncHandler(async (req, res) => {
    const vendor = await getVendorByUserIdService(req);
    return returnSuccess(res, "", 200, { vendor });
});
export const update = asyncHandler(async (req, res) => {
    const vendor = await updateVendorService(req);
    return returnSuccess(res, "vendor updated successfully", 200, { vendor });
});
export const destroy = asyncHandler(async (req, res) => {
    var _a, _b;
    await deleteVendorService(req);
    const userData = { _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email, role: UserRoles.USER };
    const tokens = sendToken(userData, res);
    return returnSuccess(res, "vendor profile deleted successfully", 200, { tokens });
});
export const dashboard = asyncHandler(async (req, res) => {
    const stats = await getVendorDashboardStatsService(req);
    return returnSuccess(res, "", 200, stats);
});
export const myProducts = asyncHandler(async (req, res) => {
    const products = await getVendorProductsService(req);
    return returnSuccess(res, "", 200, products);
});
export const myOrders = asyncHandler(async (req, res) => {
    const orders = await getVendorOrdersService(req);
    return returnSuccess(res, "", 200, orders);
});
export const updateMyOrderItemStatus = asyncHandler(async (req, res) => {
    const orderItem = await updateVendorOrderItemStatusService(req);
    return returnSuccess(res, "order item status updated successfully", 200, { orderItem });
});
//# sourceMappingURL=vendorController.js.map