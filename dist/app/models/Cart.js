import mongoose, { Schema } from "mongoose";
const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [
        {
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
                default: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
    totalPrice: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
    },
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
//# sourceMappingURL=Cart.js.map