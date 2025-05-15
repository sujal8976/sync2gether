import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors/ErrorHandler";
import prisma from "../db";

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new ErrorHandler("Not authenticated", 401);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { username: true },
    });
    if (!user) throw new ErrorHandler("User not found", 404);

    const room = await prisma.room.create({
      data: { host: req.user.userId },
    });

    await prisma.roomMembers.create({
      data: {
        userId: req.user.userId,
        roomId: room.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "room created",
      room: { id: room.id, host: room.host },
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Failed to create room", 500));
  }
};

export const joinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler("Not authenticated", 401);

    const roomId = req.params.roomId;
    if (!roomId) throw new ErrorHandler("Room Id is required", 404);

    const existingMember = await prisma.roomMembers.findFirst({
      where: {
        userId: req.user.userId,
        roomId,
      },
    });
    if (existingMember) throw new ErrorHandler("User already joined room", 400);

    await prisma.roomMembers.create({
      data: {
        userId: req.user.userId,
        roomId,
      },
    });

    res.status(200).json({
      success: true,
      message: "User joined room",
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("failed to add user in room", 500));
  }
};

export const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) throw new ErrorHandler("Not authenticated", 401);

    const roomId = req.params.roomId;
    if (!roomId) throw new ErrorHandler("Room Id is required", 404);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        host: true,
      },
    });
    if (!room) throw new ErrorHandler("Room not found", 404);

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Failed to find room", 500));
  }
};
