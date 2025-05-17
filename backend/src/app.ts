import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error";

import authRoute from "./routes/auth.routes";
import roomRoute from "./routes/room.routes";
import videoRoute from "./routes/video.routes";
import playlistRoute from "./routes/playlists.routes";
import roomMembersRoute from "./routes/room-member.routes";
import chatRoute from "./routes/chat.routes";

dotenv.config();

const app = express();

// middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        const allowedOrigins = ["https://yourdomain.com"];
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/rooms", roomRoute);
app.use("/api/v1/videos", videoRoute);
app.use("/api/v1/playlists", playlistRoute);
app.use("/api/v1/room-members", roomMembersRoute);
app.use("/api/v1/chats", chatRoute);

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Error Handler
app.use(errorMiddleware);

export default app;
