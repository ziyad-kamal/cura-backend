import { destroyRepostRepo, likeRepostRepo, storeRepostRepo, updateRepostRepo, } from "../../../repositories/users/community/repostRepository.js";
export const storeRepostService = async (req) => {
    var _a;
    return await storeRepostRepo(Object.assign({}, req.body), (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, req.params._id);
};
export const updateRepostService = async (req) => {
    return await updateRepostRepo(Object.assign(Object.assign({}, req.body), req.params));
};
export const likeRepostService = async (req) => {
    var _a;
    return await likeRepostRepo(req.params._id, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
};
export const destroyRepostService = async (req) => {
    await destroyRepostRepo(req.params._id);
};
//# sourceMappingURL=repostService.js.map