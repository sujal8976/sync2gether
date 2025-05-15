import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors/ErrorHandler";
import prisma from "../db";

export const getRoomMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const roomId = req.params.roomId;
    if (!roomId) throw new ErrorHandler("Room Id is required", 400);

    const members = await prisma.roomMembers.findMany({
      where: { roomId },
      select: {
        userId: true,
        user: {
          select: {
            username: true,
            isOnline: true,
          },
        },
      },
    });

    const modifiedMembers = members.map((m) => {
      return {
        userId: m.userId,
        username: m.user.username,
        isOnline: m.user.isOnline,
      };
    });

    res.status(200).json({
      success: true,
      members: modifiedMembers,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("failed to get room members", 500));
  }
};
