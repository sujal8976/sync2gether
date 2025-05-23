import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { handleVote } from "../controllers/vote.controller";
const router = Router();

router.post("/", authenticate, handleVote);

export default router;