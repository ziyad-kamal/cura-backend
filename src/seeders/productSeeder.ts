import Product from "../app/models/Product.js";
import Vendor from "../app/models/Vendor.js";
import Category from "../app/models/Category.js";
import { Types } from "mongoose";

export const seedProducts = async (
    vendorIds: Types.ObjectId[],
    categoryIds: Types.ObjectId[]
) => {
    await Product.deleteMany();

    const products = [];

    for (let i = 0; i < 20; i++) {
        products.push({
            title: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 5000),
            stock: 10,
            vendorId: vendorIds[i % vendorIds.length],
            categoryId: categoryIds[i % categoryIds.length],
            images: [],
        });
    }

    await Product.insertMany(products);

    return products;
};