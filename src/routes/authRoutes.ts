import express, { Router } from "express";
import { login } from "../app/controllers/loginController.ts";

const router: Router = express.Router();

router.post("/login", login);

export default router;
