import express from "express";
import { login, registration } from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/registration").post(registration);
router.route("/login").post(login);

export default router;
