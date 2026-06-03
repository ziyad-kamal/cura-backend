import Product from "../app/models/Product.js";
import Vendor from "../app/models/Vendor.js";
import Category from "../app/models/Category.js";
import { Types } from "mongoose";

export const seedProducts = async (
    vendorIds: Types.ObjectId[],
    categoryIds: Types.ObjectId[]
) => {
    await Product.deleteMany();

    const realImages = [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", 
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71",

        "https://images.unsplash.com/photo-1579758629938-03607ccdbaba", 
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d", 
        "https://images.unsplash.com/photo-1611571483616-a53da30c6c9a", 
        "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1", 
        "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04", 
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843", 
     
        "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c", 
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd", 
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61", 
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e", 
        "https://images.unsplash.com/photo-1605296867304-46d5465a25f1", 
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5", 
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712"  
    ];

    const products = [];

    for (let i = 0; i < 50; i++) {
        products.push({
            title: `Product ${i + 1}`,
            price: Math.floor(Math.random() * 5000),
            stock: 10,
            vendorId: vendorIds[i % vendorIds.length],
            categoryId: categoryIds[i % categoryIds.length],
            images: [realImages[i % realImages.length]], 
        });
    }

    return await Product.insertMany(products);
};