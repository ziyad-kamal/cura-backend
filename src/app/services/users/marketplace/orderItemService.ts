import { Request } from "express";
import OrderItem from "../../../models/OrderItem.js";

export const indexOrderItemsService = async (req: Request) => {
    return await OrderItem.find();
};

export const showOrderItemService = async (req: Request) => {
    return await OrderItem.findById(req.params.id);
};

export const updateOrderItemStatusService = async (req: Request) => {
    return await OrderItem.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        {
            returnDocument: "after",
        },
    );
};
