import mongoose, { Schema } from "mongoose";
import { WishlistInterface } from "../../interfaces/models/WishlistInterface.js";

const wishlistSchema = new Schema<WishlistInterface>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Wishlist = mongoose.model<WishlistInterface>(
    "Wishlist",
    wishlistSchema
);

export default Wishlist;