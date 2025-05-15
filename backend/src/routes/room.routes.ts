import { Router } from "express";
import { createRoom, getRoom, joinRoom } from "../controllers/rooms.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, createRoom);
router.get("/:roomId", authenticate, getRoom);
router.post("/:roomId", authenticate, joinRoom);

export default router;
