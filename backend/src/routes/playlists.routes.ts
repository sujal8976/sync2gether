import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
  addVideoToPlaylist,
  getPlaylist,
} from "../controllers/playlists.controller";

const router = Router();

router.post("/", authenticate, addVideoToPlaylist);
router.get("/", authenticate, getPlaylist);

export default router;
