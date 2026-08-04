import { showMessageService } from "../../../services/users/consultation/messageService.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { returnSuccess } from "../../../utils/returnJson.js";
export const show = asyncHandler(async (req, res) => {
    const messages = await showMessageService(req);
    return returnSuccess(res, "", 200, messages);
});
//# sourceMappingURL=messageController.js.map