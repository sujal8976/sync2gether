import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors/ErrorHandler";
import { VideoData } from "../types/video";
import prisma from "../db";

export const addVideoToPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const {
      title,
      youtubeVideoId,
      thumbnail,
      roomId,
    }: VideoData & { roomId: string } = req.body;
    if (!title || !youtubeVideoId || !thumbnail || !roomId)
      throw new ErrorHandler("Provide all required data of video", 400);

    await prisma.playlist.create({
      data: {
        title,
        thumbnail,
        youtubeVideoId,
        userId: req.user.userId,
        roomId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Video added to playlist",
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else throw new ErrorHandler("Failed to add video in playlist", 500);
  }
};

export const getPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const roomId = req.query.roomId?.toString();
    if (!roomId) throw new ErrorHandler("Provide RoomId to get Playlist", 400);

    const playlist = await prisma.playlist.findMany({
      where: { roomId },
    });

    res.status(200).json({
      success: true,
      playlist,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else throw new ErrorHandler("Failed to get playlist", 500);
  }
};
