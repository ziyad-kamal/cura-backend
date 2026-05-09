import mongoose from "mongoose";
import { ProductInterface } from './ProductInterface.js';

export interface CartInterface {
    userId: mongoose.Types.ObjectId;
    products: ProductInterface[];
}
