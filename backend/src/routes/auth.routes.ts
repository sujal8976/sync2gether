import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  me,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.get("/me", authenticate, me);

export default router;