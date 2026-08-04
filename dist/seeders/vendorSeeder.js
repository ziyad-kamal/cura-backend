import Vendor from "../app/models/Vendor.js";
export const seedVendors = async (userIds) => {
    await Vendor.deleteMany();
    const vendors = await Vendor.insertMany(userIds.map((id, i) => ({
        userId: id,
        storeName: `Store ${i + 1}`,
        storeSlug: `store-${i + 1}`,
        isVerified: true,
    })));
    return vendors;
};
//# sourceMappingURL=vendorSeeder.js.map