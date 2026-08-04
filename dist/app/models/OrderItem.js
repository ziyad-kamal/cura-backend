import mongoose, { Schema } from "mongoose";
const orderItemSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;
//# sourceMappingURL=OrderItem.js.map