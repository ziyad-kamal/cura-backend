import express from "express";
import { destroy, index, show, store, update } from "../../../app/controllers/users/marketplace/productController.js";
import { jwtVerify, requireRole } from "../../../app/middlewares/index.js";
import { UserRoles } from "../../../enums/UserRoles.js";
const router = express.Router();
router.get("/", index);
router.post("/", jwtVerify, requireRole(UserRoles.VENDOR), store);
router.get("/:id", show);
router.patch("/:id", jwtVerify, requireRole(UserRoles.VENDOR), update);
router.delete("/:id", jwtVerify, requireRole(UserRoles.VENDOR), destroy);
export default router;
//# sourceMappingURL=productRoutes.js.map