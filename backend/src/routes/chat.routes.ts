import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { getChats } from "../controllers/chats.controller";

const router = Router();

router.get("/", authenticate, getChats);

export default router;
