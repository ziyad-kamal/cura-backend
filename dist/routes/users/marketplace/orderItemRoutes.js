import express from "express";
import { index, show, updateStatus } from "../../../app/controllers/users/marketplace/orderItemController.js";
const router = express.Router();
router.get("/", index);
router.get("/:id", show);
router.patch("/:id/status", updateStatus);
export default router;
//# sourceMappingURL=orderItemRoutes.js.map