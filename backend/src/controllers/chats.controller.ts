import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors/ErrorHandler";
import prisma from "../db";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const roomId = req.query.roomId?.toString();
    if (!roomId)
      throw new ErrorHandler(
        "Room ID is required to search for messages.",
        400
      );

    if (
      !(await prisma.roomMembers.findUnique({
        where: {
          userId_roomId: {
            userId: req.user.userId,
            roomId,
          },
        },
      }))
    ) {
      throw new ErrorHandler("You not have the access for this room.", 401);
    }

    const page = parseInt(req.query.page ? req.query.page.toString() : "1");
    const limit = parseInt(req.query.limit ? req.query.limit.toString() : "30");
    const skip = (page - 1) * limit;

    const [chats, totalChats] = await prisma.$transaction([
      prisma.chat.findMany({
        where: {
          roomId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
        select: {
          id: true,
          message: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              id: true,
            },
          },
        },
      }),
      prisma.chat.count({
        where: { roomId },
      }),
    ]);

    res.status(200).json({
      success: true,
      chats,
      totalCount: totalChats,
      currentPage: page,
      totalPage: Math.ceil(totalChats / limit),
      hasMore: skip + chats.length < totalChats,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Failed to fetch chats", 500));
  }
};
