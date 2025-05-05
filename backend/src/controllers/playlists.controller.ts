import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { VideoData } from "../types/video";
import prisma from "../db";
import { Playlist } from "../types/playlist";

export const addVideoToPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const roomId = req.query.roomId?.toString();

    const { title, videoId, thumbnail }: VideoData = req.body;
    if (!title || !videoId || !thumbnail)
      throw new ErrorHandler("Provide all required data of video", 400);

    await prisma.playlist.create({
      data: {
        title,
        thumbnail,
        videoId,
        userId: req.user.userId,
        roomId: roomId,
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

export const getPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const userId = req.query.userId?.toString();
    const roomId = req.query.roomId?.toString();
    if (!roomId && !userId)
      throw new ErrorHandler("Provide userId or RoomId to get Playlist", 400);
    if (roomId && roomId)
      throw new ErrorHandler("Provided both userId and RoomId", 400);

    let playlists: Playlist[];
    if (roomId) {
      playlists = await prisma.playlist.findMany({
        where: { roomId },
      });
    } else {
      playlists = await prisma.playlist.findMany({
        where: { userId },
      });
    }

    res.status(200).json({
      success: true,
      playlists 
    })
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else throw new ErrorHandler("Failed to get playlist", 500);
  }
};
