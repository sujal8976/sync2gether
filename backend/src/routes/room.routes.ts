import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/rooms.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, createRoom);
router.post("/:roomId", authenticate, joinRoom);

export default router;
