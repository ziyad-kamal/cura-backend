import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
import { checkUsersStatusService, getChatroomService, indexChatroomsService, endChatroomService } from "../../../services/users/consultation/chatroomService.js";
export const index = asyncHandler(async (req, res) => {
    const chatrooms = await indexChatroomsService(req);
    return returnSuccess(res, "", 200, chatrooms);
});
export const get = asyncHandler(async (req, res) => {
    const chatroom = await getChatroomService(req);
    return returnSuccess(res, "", 200, chatroom);
});
export const checkUsersStatus = asyncHandler(async (req, res) => {
    const onlineStatusMap = await checkUsersStatusService(req);
    return returnSuccess(res, "", 200, { onlineStatusMap });
});
export const endChatroom = asyncHandler(async (req, res) => {
    var _a, _b;
    const chatroomId = req.params.chatroomId;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
    const chatroom = await endChatroomService(chatroomId, userId);
    return returnSuccess(res, "Session ended successfully", 200, chatroom);
});
//# sourceMappingURL=chatroomController.js.map