import Product from "../../../models/Product.js";
import { createProductService, deleteProductService, showProductService, updateProductService, } from "../../../services/users/marketplace/productService.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
export const index = async (req, res) => {
    try {
        const { page = 1, limit = 15, search, category, minPrice, maxPrice, sortBy, inStock, minRating } = req.query;
        // 1. Pagination values
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Number(limit) || 15);
        // 2. Build query object
        const query = {};
        // Search
        if (search) {
            query.title = {
                $regex: search,
                $options: "i",
            };
        }
        // Category
        if (category && category !== "All Products") {
            const { default: Category } = await import("../../../models/Category.js");
            const categoryDoc = await Category.findOne({
                name: category,
            });
            if (categoryDoc) {
                query.categoryId = categoryDoc._id;
            }
        }
        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
        }
        // In Stock filter
        if (inStock === "true") {
            query.stock = { $gt: 0 };
        }
        // Minimum Rating filter
        if (minRating && Number(minRating) > 0) {
            query.ratingAverage = { $gte: Number(minRating) };
        }
        // 3. Build sort query
        let sortQuery = {};
        switch (sortBy) {
            case "priceLow":
                sortQuery = { price: 1 };
                break;
            case "priceHigh":
                sortQuery = { price: -1 };
                break;
            case "rating":
                sortQuery = { ratingAverage: -1 };
                break;
            case "newest":
                sortQuery = { createdAt: -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }
        // 4. Fetch data (مرة واحدة فقط)
        const [products, total] = await Promise.all([
            Product.find(query)
                .populate("categoryId")
                .populate("vendorId")
                .sort(sortQuery)
                .limit(limitNum)
                .skip((pageNum - 1) * limitNum)
                .lean(),
            Product.countDocuments(query),
        ]);
        const productsWithImages = await Promise.all(products.map(async (product) => (Object.assign(Object.assign({}, product), { images: await resolveFiles(product.images || [], "public") }))));
        // 5. Pagination data
        const totalPages = Math.ceil(total / limitNum);
        return res.status(200).json({
            success: true,
            data: productsWithImages,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: totalPages,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Internal Server Error",
        });
    }
};
export const show = async (req, res) => {
    try {
        const product = await showProductService(req);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const images = await resolveFiles(product.images || [], "public");
        return res.status(200).json({
            success: true,
            data: Object.assign(Object.assign({}, product), { images }),
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || "Error",
        });
    }
};
export const store = async (req, res) => {
    try {
        const product = await createProductService(req);
        return res.status(201).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating product",
        });
    }
};
export const update = async (req, res) => {
    try {
        const product = await updateProductService(req);
        return res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating product",
        });
    }
};
export const destroy = async (req, res) => {
    try {
        await deleteProductService(req);
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting product",
        });
    }
};
//# sourceMappingURL=productController.js.map