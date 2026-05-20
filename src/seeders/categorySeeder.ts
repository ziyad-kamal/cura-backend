import Category from "../app/models/Category.js";

export const seedCategories = async () => {
    await Category.deleteMany();

    const categories = await Category.insertMany([
        { name: "Electronics", slug: "electronics" },
        { name: "Fashion", slug: "fashion" },
        { name: "Home", slug: "home" },
    ]);

    console.log("Categories Seeded");
    return categories;

};