import { asyncHandler } from '../../utils/asyncHandler.js';
import { returnSuccess } from '../../utils/returnJson.js';
import { destroyFileService, downloadFileService, uploadFileService } from "../../services/users/fileService.js";
export const upload = asyncHandler(async (req, res) => {
    const file = await uploadFileService(req);
    return returnSuccess(res, "you uploaded file successfully", 200, { file });
});
export const download = asyncHandler(async (req, res) => {
    const url = await downloadFileService(req);
    return returnSuccess(res, "File download URL generated successfully", 200, { url });
});
export const destroy = asyncHandler(async (req, res) => {
    await destroyFileService(req);
    return returnSuccess(res, "you deleted file successfully", 200);
});
//# sourceMappingURL=fileController.js.map