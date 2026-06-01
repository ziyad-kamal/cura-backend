import { Request } from "express";
import Vendor from "../../models/Vendor.js";

export const indexVendorsService = async (req: Request) => {
    return await Vendor.find();
};

export const createVendorService = async (req: Request) => {
    const vendor = await Vendor.create(req.body);
    return vendor;
};

export const showVendorService = async (req: Request) => {
    return await Vendor.findById(req.params.id);
};

export const updateVendorService = async (req: Request) => {
    return await Vendor.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    });
};

export const deleteVendorService = async (req: Request) => {
    return await Vendor.findByIdAndDelete(req.params.id);
};