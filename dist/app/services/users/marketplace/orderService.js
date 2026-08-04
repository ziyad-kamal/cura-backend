import Cart from "../../../models/Cart.js";
import Order from "../../../models/Order.js";
import OrderItem from "../../../models/OrderItem.js";
import Product from "../../../models/Product.js";
export const mapOrderForFrontend = async (order) => {
    const orderObj = order.toObject ? order.toObject() : order;
    // Fetch associated OrderItems and populate their product details
    const items = await OrderItem.find({ orderId: orderObj._id }).populate({
        path: "productId",
        select: "title name price images image category vendorId description",
    });
    // Map each item to match the frontend expectations
    const mappedItems = items.map((item) => {
        var _a, _b, _c, _d;
        const itemObj = item.toObject ? item.toObject() : item;
        const p = itemObj.productId || {};
        // Provide standard fields expected by the frontend
        return Object.assign(Object.assign({}, itemObj), { name: p.title || p.name || "Product", price: (_b = (_a = itemObj.price) !== null && _a !== void 0 ? _a : p.price) !== null && _b !== void 0 ? _b : 0, quantity: (_c = itemObj.quantity) !== null && _c !== void 0 ? _c : 1, image: ((_d = p.images) === null || _d === void 0 ? void 0 : _d[0]) || p.image || "/placeholder-product.png", category: p.category || "Wellness", vendorId: itemObj.vendorId || p.vendorId });
    });
    return Object.assign(Object.assign({}, orderObj), { id: orderObj._id.toString(), status: orderObj.orderStatus || "pending", totalAmount: orderObj.totalPrice || 0, total: orderObj.totalPrice || 0, items: mappedItems });
};
export const indexOrdersService = async (req) => {
    var _a, _b;
    const orders = await Order.find({
        userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id),
    }).sort({ createdAt: -1 });
    return await Promise.all(orders.map((order) => mapOrderForFrontend(order)));
};
export const createOrderService = async (req) => {
    var _a, _b;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
    const cart = await Cart.findOne({ userId });
    const order = await Order.create({
        userId,
        totalPrice: (cart === null || cart === void 0 ? void 0 : cart.totalPrice) || 0,
        shippingAddress: req.body.shippingAddress,
    });
    if (cart && cart.items.length > 0) {
        // Create order items and decrease stock
        await Promise.all(cart.items.map(async (item) => {
            // Decrease product stock
            const product = await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, { new: true });
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            if (product.stock < 0) {
                // Restore stock if something went wrong
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
                throw new Error(`Insufficient stock for product: ${product.title}`);
            }
            // Create order item
            await OrderItem.create({
                orderId: order._id,
                productId: item.productId,
                vendorId: item.vendorId,
                quantity: item.quantity,
                price: item.price,
            });
        }));
        // Clear the cart in database after successfully creating order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    }
    return await mapOrderForFrontend(order);
};
export const showOrderService = async (req) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new Error("Order not found");
    }
    return await mapOrderForFrontend(order);
};
export const cancelOrderService = async (req) => {
    var _a, _b;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new Error("Order not found");
    }
    if (order.userId.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString())) {
        throw new Error("Unauthorized: You do not own this order");
    }
    if (order.orderStatus !== "pending") {
        throw new Error("Cannot cancel order unless it is pending");
    }
    order.orderStatus = "cancelled";
    await order.save();
    // Restore stock for all order items
    const orderItems = await OrderItem.find({ orderId: req.params.id });
    await Promise.all(orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }, { new: true });
    }));
    return await mapOrderForFrontend(order);
};
export const updateOrderStatusService = async (req) => {
    const { orderStatus, paymentStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, (orderStatus && { orderStatus })), (paymentStatus && { paymentStatus })), {
        new: true,
    });
    if (!updatedOrder) {
        throw new Error("Order not found");
    }
    return await mapOrderForFrontend(updatedOrder);
};
export const updateOrderItemStatusService = async (req) => {
    const { itemId } = req.params;
    const { status } = req.body;
    const orderItem = await OrderItem.findByIdAndUpdate(itemId, { status }, { new: true }).populate({
        path: "productId",
        select: "title name price images image category vendorId description",
    });
    if (!orderItem) {
        throw new Error("Order item not found");
    }
    return orderItem;
};
//# sourceMappingURL=orderService.js.map