import mongoose, { Model, Schema } from "mongoose";
import "./Comment.js";
import "./User.js";
import { productSchema } from './Product.js';
import { CartInterface } from '../../interfaces/models/CartInterface.js';

const cartSchema = new Schema<CartInterface>(
    {
        products: [productSchema],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

const Cart: Model<CartInterface> = mongoose.model<CartInterface>("Cart", cartSchema);

export default Cart;
