import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors/ErrorHandler";
import prisma from "../db";

interface handleVoteRequest {
  playlistId: string;
  voteType: -1 | 1;
}

export const handleVote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler("Not Authenticated", 401);
    const userId = req.user.userId;

    const { playlistId, voteType }: handleVoteRequest = req.body;

    if (![1, -1].includes(voteType))
      throw new ErrorHandler("Invalid vote type", 400);

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_playlistId: {
          playlistId,
          userId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // same vote - remove vote
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });

        res.status(200).json({
          success: true,
          message: "Vote removed",
        });
        return;
      } else {
        // different vote - update vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });

        res.status(200).json({
          success: true,
          message: "Vote updated",
        });
        return;
      }
    } else {
      // no existing vote - create vote
      await prisma.vote.create({
        data: {
          voteType,
          userId,
          playlistId,
        },
      });

      res.status(201).json({
        success: true,
        message: "Vote added",
      });
      return;
    }
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("failed to upvote or downvote", 500));
  }
};
