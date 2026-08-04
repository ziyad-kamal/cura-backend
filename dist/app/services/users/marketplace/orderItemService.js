import OrderItem from "../../../models/OrderItem.js";
export const indexOrderItemsService = async (req) => {
    return await OrderItem.find();
};
export const showOrderItemService = async (req) => {
    return await OrderItem.findById(req.params.id);
};
export const updateOrderItemStatusService = async (req) => {
    return await OrderItem.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, {
        returnDocument: "after",
    });
};
//# sourceMappingURL=orderItemService.js.map