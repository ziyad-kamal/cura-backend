import mongoose from "mongoose";
import { ProductInterface } from './ProductInterface.js';

export interface CartInterface {
    user: mongoose.Types.ObjectId;
    products: ProductInterface[];
}
