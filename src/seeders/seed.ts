import { Types } from "mongoose";

import { connectDB } from "../config/index.js";
import { UserInterface } from "../interfaces/models/UserInterface.js";
import { seedComments, seedPosts, seedUsers } from "./index.js";
import seedLikes from "./likeSeeder.js";
import seedAdmins from "./adminSeeder.js";
import seedCompanies from "./companySeeder.js";
import { CommentInterface } from "../interfaces/models/CommentInterface.js";
import seedReposts from "./repostSeeder.js";
import seedConnections from "./ConnectionSeeder.js";

import { seedCategories } from "./categorySeeder.js";
import { seedVendors } from "./vendorSeeder.js";
import { seedProducts } from "./productSeeder.js";
import seedConsultations from "./consultationSeeder.js";
import seedTreatmentPlans from "./treatmentPlanSeeder.js";
import seedCarts from "./cartSeeder.js";

const seedAll = async () => {
    try {
        await connectDB();

        console.log("🌱 Starting database seeding...");

        // =====================
        // EXISTING SYSTEM (NO CHANGE)
        // =====================
        const { createdUsers, authUser } = await seedUsers(100);

        const userIds = createdUsers
            .map((user: UserInterface) => user._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        const createdPosts = await seedPosts(userIds);

        const postIds = createdPosts
            .map((post) => post._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        const createdComments = await seedComments(30, postIds, userIds);

        const commentIds = createdComments
            .map((comment: CommentInterface) => comment._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        await seedLikes(3, 3, postIds, commentIds, userIds);
        await seedReposts(5, postIds, userIds);
        await seedConnections(10, userIds, authUser._id);

        // =====================
        // NEW: ADMIN & COMPANY SYSTEM
        // =====================
        const createdAdmins = await seedAdmins(10);
        const adminIds = createdAdmins.map(a => a._id).filter((id): id is Types.ObjectId => id !== undefined);
        await seedCompanies(10, adminIds);

        // =====================
        // NEW: MARKETPLACE SYSTEM
        // =====================
        console.log("🛒 Seeding Marketplace Data...");

        // 1. Categories
        const categories = await seedCategories();
        const categoryIds = categories
            .map((c: any) => c._id)
            .filter((id: Types.ObjectId) => id);

        // 2. Vendors (use existing users - NO user seeding)
        const vendors = await seedVendors(userIds.slice(0, 10));
        const vendorIds = vendors
            .map((v: any) => v._id)
            .filter((id: Types.ObjectId) => id);

        // 3. Products (depend on vendors + categories)
        const products = await seedProducts(vendorIds, categoryIds);
 
        // 4. Carts (Seeding carts for a subset of users)
        await seedCarts(userIds.slice(10, 30), products);

        console.log("🎉 Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedAll();