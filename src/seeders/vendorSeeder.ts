import Vendor from "../app/models/Vendor.js";
import { Types } from "mongoose";

export const seedVendors = async (userIds: Types.ObjectId[]) => {
    await Vendor.deleteMany();

    const vendors = await Vendor.insertMany(
        userIds.map((id, i) => ({
            userId: id,
            storeName: `Store ${i + 1}`,
            storeSlug: `store-${i + 1}`,
            isVerified: true,
        }))
    );

    return vendors;
};