import { Request } from "express";

import Order from "../../models/Order.js";
import OrderItem from "../../models/OrderItem.js";
import Cart from "../../models/Cart.js";

export const indexOrdersService = async (req: Request) => {
    return await Order.find({
        userId: req.user?.id,
    });
};

export const createOrderService = async (req: Request) => {
    const cart = await Cart.findOne({
        userId: req.user?.id,
    });

    const order = await Order.create({
        userId: req.user?.id,
        totalPrice: cart?.totalPrice,
        shippingAddress: req.body.shippingAddress,
    });

    if (cart) {
        await Promise.all(
            cart.items.map(async (item) => {
                await OrderItem.create({
                    orderId: order._id,
                    productId: item.productId,
                    vendorId: item.vendorId,
                    quantity: item.quantity,
                    price: item.price,
                });
            })
        );
    }

    return order;
};

export const showOrderService = async (req: Request) => {
    return await Order.findById(req.params.id);
};

export const cancelOrderService = async (req: Request) => {
    return await Order.findByIdAndUpdate(
        req.params.id,
        {
            orderStatus: "cancelled",
        },
        {
            returnDocument: "after",
        },
    );
};