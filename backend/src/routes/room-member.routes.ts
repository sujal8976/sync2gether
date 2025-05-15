import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { getRoomMembers } from "../controllers/room-member.controller";

const router = Router();

router.get("/:roomId", authenticate, getRoomMembers);

export default router;