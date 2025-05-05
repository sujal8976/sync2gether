import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { searchVideo } from "../controllers/videos.controller";

const router = Router();

router.get("/", authenticate, searchVideo);

export default router;