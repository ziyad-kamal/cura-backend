import { createCategoryService, deleteCategoryService, indexCategoriesService, showCategoryService, updateCategoryService, } from "../../../services/users/marketplace/categoryService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const index = asyncHandler(async (req, res) => {
    const categories = await indexCategoriesService(req);
    return returnSuccess(res, "", 200, categories);
});
export const store = asyncHandler(async (req, res) => {
    const category = await createCategoryService(req);
    return returnSuccess(res, "category created successfully", 201, {
        category,
    });
});
export const show = asyncHandler(async (req, res) => {
    const category = await showCategoryService(req);
    return returnSuccess(res, "", 200, {
        category,
    });
});
export const update = asyncHandler(async (req, res) => {
    const category = await updateCategoryService(req);
    return returnSuccess(res, "category updated successfully", 200, {
        category,
    });
});
export const destroy = asyncHandler(async (req, res) => {
    await deleteCategoryService(req);
    return returnSuccess(res, "category deleted successfully", 200);
});
//# sourceMappingURL=categoryController.js.map