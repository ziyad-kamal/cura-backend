import express from "express";
import {
    accept,
    cancel,
    connect,
    getConnections,
    ignore,
    index,
    update,
} from "../../../app/controllers/users/community/profileController.js";
import { authorize } from "../../../app/middlewares/authorize.js";
import { jwtVerify } from "../../../app/middlewares/jwtVerify.js";
import { validateId } from "../../../app/middlewares/validateId.js";
import { profileValidator } from "../../../app/validators/profileValidator.js";
import Connection from "../../../app/models/Connection.js";

const profileRoutes = express.Router();

profileRoutes.use(jwtVerify);
profileRoutes.get("/:userId", validateId("userId"), index);
profileRoutes.get("/get/connections", getConnections);
profileRoutes.put(
    "/update",
    profileValidator,
    update,
);

profileRoutes.post("/connect/:userId", validateId("userId"), connect);
profileRoutes.put(
    "/accept/:connectionId",
    validateId("connectionId"),
    authorize(Connection, "connectionId", ["receiver"]),
    accept,
);

profileRoutes.put(
    "/ignore/:connectionId",
    validateId("connectionId"),
    authorize(Connection, "connectionId", ["receiver"]),
    ignore,
);

profileRoutes.delete(
    "/withdraw/:connectionId",
    validateId("connectionId"),
    authorize(Connection, "connectionId", ["sender"]),
    cancel,
);

profileRoutes.delete(
    "/cancel/:connectionId",
    validateId("connectionId"),
    authorize(Connection, "connectionId", ["sender", "receiver"]),
    cancel,
);

export default profileRoutes;
