import { Request } from "express";

import Order from "../../models/Order.js";
import OrderItem from "../../models/OrderItem.js";
import Cart from "../../models/Cart.js";

const mapOrderForFrontend = async (order: any) => {
    const orderObj = order.toObject ? order.toObject() : order;
    
    // Fetch associated OrderItems and populate their product details
    const items = await OrderItem.find({ orderId: orderObj._id }).populate({
        path: "productId",
        select: "title name price images image category vendorId description",
    });

    // Map each item to match the frontend expectations
    const mappedItems = items.map((item: any) => {
        const itemObj = item.toObject ? item.toObject() : item;
        const p = itemObj.productId || {};
        
        // Provide standard fields expected by the frontend
        return {
            ...itemObj,
            name: p.title || p.name || "Product",
            price: itemObj.price ?? p.price ?? 0,
            quantity: itemObj.quantity ?? 1,
            image: p.images?.[0] || p.image || "/placeholder-product.png",
            category: p.category || "Wellness",
            vendorId: itemObj.vendorId || p.vendorId,
        };
    });

    return {
        ...orderObj,
        id: orderObj._id.toString(),
        status: orderObj.orderStatus || "pending",
        totalAmount: orderObj.totalPrice || 0,
        total: orderObj.totalPrice || 0,
        items: mappedItems,
    };
};

export const indexOrdersService = async (req: Request) => {
    const orders = await Order.find({
        userId: req.user?.id || req.user?._id,
    }).sort({ createdAt: -1 });

    return await Promise.all(orders.map(order => mapOrderForFrontend(order)));
};

export const createOrderService = async (req: Request) => {
    const userId = req.user?.id || req.user?._id;
    const cart = await Cart.findOne({ userId });

    const order = await Order.create({
        userId,
        totalPrice: cart?.totalPrice || 0,
        shippingAddress: req.body.shippingAddress,
    });

    if (cart && cart.items.length > 0) {
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

        // Clear the cart in database after successfully creating order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    }

    return await mapOrderForFrontend(order);
};

export const showOrderService = async (req: Request) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new Error("Order not found");
    }
    return await mapOrderForFrontend(order);
};

export const cancelOrderService = async (req: Request) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
            orderStatus: "cancelled",
        },
        {
            new: true,
        }
    );

    if (!updatedOrder) {
        throw new Error("Order not found");
    }

    return await mapOrderForFrontend(updatedOrder);
};