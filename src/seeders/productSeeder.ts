import Product from "../app/models/Product.js";
import Vendor from "../app/models/Vendor.js";
import Category from "../app/models/Category.js";
import { Types } from "mongoose";

export const seedProducts = async (vendorIds: Types.ObjectId[], categoryIds: Types.ObjectId[]) => {
    await Product.deleteMany();

    const products = [];

    for (let i = 0; i < 50; i++) {
        products.push({
            title: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 5000),
            stock: 10,
            vendorId: vendorIds[i % vendorIds.length],
            categoryId: categoryIds[i % categoryIds.length],
            images: [
                { s3Key: "staging/039d157188b33ce23e5b96def8bf2093.png" },
                { s3Key: "staging/039d157188b33ce23e5b96def8bf2093.png" },
            ],
        });
    }

    return await Product.insertMany(products);
};
