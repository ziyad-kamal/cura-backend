import Category from "../../../models/Category.js";
export const indexCategoriesService = async (req) => {
    return await Category.find();
};
export const createCategoryService = async (req) => {
    return await Category.create(req.body);
};
export const showCategoryService = async (req) => {
    return await Category.findById(req.params.id);
};
export const updateCategoryService = async (req) => {
    return await Category.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    });
};
export const deleteCategoryService = async (req) => {
    return await Category.findByIdAndDelete(req.params.id);
};
//# sourceMappingURL=categoryService.js.map