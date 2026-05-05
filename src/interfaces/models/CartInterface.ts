import mongoose from "mongoose";
import { ProductInterface } from "./ProductInterface.ts";

export interface CartInterface {
    userId: mongoose.Types.ObjectId;
    products: ProductInterface[];
}
