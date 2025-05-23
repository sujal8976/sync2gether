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

    if (
      await prisma.playlist.findUnique({
        where: {
          roomId_youtubeVideoId: {
            roomId,
            youtubeVideoId,
          },
        },
      })
    )
      throw new ErrorHandler("Video already is in the playlist", 400);

    const videoData = await prisma.playlist.create({
      data: {
        title,
        thumbnail,
        youtubeVideoId,
        userId: req.user.userId,
        roomId,
      },
      select: {
        id: true,
        title: true,
        youtubeVideoId: true,
        thumbnail: true,
        user: {
          select: {
            username: true,
          },
        },
        votes: {
          select: {
            voteType: true,
            userId: true,
          },
        },
      },
    });

    const userId = req.user.userId;

    const transformedVideo = {
      id: videoData.id,
      youtubeVideoId: videoData.youtubeVideoId,
      title: videoData.title,
      thumbnail: videoData.thumbnail,
      addedBy: videoData.user.username,
      upVote: videoData.votes.filter((vote) => vote.voteType === 1).length,
      downVote: videoData.votes.filter((vote) => vote.voteType === -1).length,
      userVote:
        videoData.votes.find((vote) => vote.userId === userId)?.voteType ?? 0,
    };

    res.status(200).json({
      success: true,
      video: transformedVideo,
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
      select: {
        id: true,
        title: true,
        youtubeVideoId: true,
        thumbnail: true,
        user: {
          select: {
            username: true,
          },
        },
        votes: {
          select: {
            voteType: true,
            userId: true,
          },
        },
      },
    });

    const userId = req.user.userId;

    const transformedPlaylist = playlist.map((video) => {
      const upVote = video.votes.filter((vote) => vote.voteType === 1).length;
      const downVote = video.votes.filter(
        (vote) => vote.voteType === -1
      ).length;

      const userVote =
        video.votes.find((vote) => vote.userId === userId)?.voteType ?? 0;

      return {
        id: video.id,
        youtubeVideoId: video.youtubeVideoId,
        title: video.title,
        thumbnail: video.thumbnail,
        addedBy: video.user.username,
        upVote,
        downVote,
        userVote, // this will still be used on frontend as needed
      };
    });

    res.status(200).json({
      success: true,
      playlist: transformedPlaylist,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Failed to get playlist", 500));
  }
};
