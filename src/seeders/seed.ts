/* eslint-disable no-console */
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
import seedCarts from "./cartSeeder.js";
import { CategoryInterface } from "../interfaces/models/CategoryInterface.js";
import { VendorInterface } from "../interfaces/models/VendorInterface.js";
import seedChatrooms from "./chatroomSeeder.js";
import seedMessages from "./messageSeeder.js";
import seedConsultations from "./consultationSeeder.js";
import seedDoctors from "./doctorSeeder.js";

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

        const postIds = createdPosts.map((post) => post._id).filter((id): id is Types.ObjectId => id !== undefined);

        const createdComments = await seedComments(30, postIds, userIds);

        const commentIds = createdComments
            .map((comment: CommentInterface) => comment._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        await seedLikes(3, 3, postIds, commentIds, userIds);
        await seedReposts(5, postIds, userIds);
        await seedConnections(10, userIds, authUser._id);

        // =====================
        // DOCTOR SYSTEM
        // =====================
        const doctorSubset = userIds.slice(0, 20); // لنأخذ أول 20 مستخدم كأطباء
        const doctorIds = await seedDoctors(doctorSubset);

        const createdConsultations = await seedConsultations(50, userIds, doctorIds);

        const consultationIds = createdConsultations
            .map((consult) => consult._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        const createdChatrooms = await seedChatrooms(30, userIds, [], consultationIds, authUser._id);
        const chatRoomsIds = createdChatrooms
            .map((chatroom) => chatroom._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        const createdMessages = await seedMessages(authUser._id, userIds, chatRoomsIds);
        const messageIds = createdMessages
            .map((message) => message._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        await seedChatrooms(30, userIds, messageIds, consultationIds, authUser._id);

        // =====================
        // NEW: ADMIN & COMPANY SYSTEM
        // =====================
        const createdAdmins = await seedAdmins(10);
        const adminIds = createdAdmins.map((a) => a._id).filter((id): id is Types.ObjectId => id !== undefined);
        await seedCompanies(10, adminIds);

        // =====================
        // NEW: MARKETPLACE SYSTEM
        // =====================
        console.log("🛒 Seeding Marketplace Data...");

        // 1. Categories
        const categories = await seedCategories();
        const categoryIds = categories.map((c: CategoryInterface) => c._id).filter((id: Types.ObjectId) => id);

        // 2. Vendors (use existing users - NO user seeding)
        const vendors = await seedVendors(userIds.slice(0, 10));
        const vendorIds = vendors.map((v: VendorInterface) => v._id).filter((id: Types.ObjectId) => id);

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
