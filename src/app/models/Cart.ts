import mongoose, { Model, Schema } from "mongoose";
import "./Comment.ts";
import "./User.ts";
import { productSchema } from "./Product.ts";
import { CartInterface } from "../../interfaces/models/CartInterface.ts";

const cartSchema = new Schema<CartInterface>(
    {
        products: [productSchema],
        userId: {
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
