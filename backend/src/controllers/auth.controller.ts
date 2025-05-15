import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken,
} from "../utils/jwt/jwt";
import { loginSchema, registerSchema } from "../schemas/auth";
import ErrorHandler from "../utils/errors/ErrorHandler";
import { z } from "zod";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validateData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validateData.email },
          { username: validateData.username },
        ],
      },
    });
    if (existingUser)
      throw new ErrorHandler(
        "User already exists with this email or username.",
        409
      );

    const hashedPassword = await bcrypt.hash(validateData.password, 10);

    //create user
    const user = await prisma.user.create({
      data: {
        email: validateData.email,
        password: hashedPassword,
        username: validateData.username,
        isOnline: false
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = await generateRefreshToken(user.id);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user.id, email: user.email, username: user.username, accessToken },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ErrorHandler("Provide all fields", 400));
    } else if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to create User", 500));
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validateData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validateData.email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!user) throw new ErrorHandler("Invalid Credentials", 401);

    const isPasswordValid = await bcrypt.compare(
      validateData.password,
      user.password
    );

    if (!isPasswordValid) throw new ErrorHandler("Invalid Credentials", 401);

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = await generateRefreshToken(user.id);

    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: { id: user.id, email: user.email, username: user.username, accessToken },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ErrorHandler("Provide all fields", 400));
    } else if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to Login", 500));
    }
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new ErrorHandler("Refresh token required", 401);

    const userId = await verifyRefreshToken(refreshToken);

    if (!userId) {
      clearAccessToken(res);
      clearRefreshToken(res);
      throw new ErrorHandler("Invalid or expired refresh token", 401);
    }

    const newAccessToken = generateAccessToken({ userId });
    const newRefreshToken = await generateRefreshToken(userId);

    await deleteRefreshToken(refreshToken);

    setAccessToken(res, newAccessToken);
    setRefreshToken(res, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      newAccessToken
    });
  } catch (error) {
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to refresh token", 500));
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    clearAccessToken(res);
    clearRefreshToken(res);

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    next(new ErrorHandler("Failed to logout", 401));
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ErrorHandler("Not authenticated", 401);

    const accessToken: string = req.cookies.accessToken;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        username: true,
        id: true,
        email: true,
      },
    });

    if (!user) throw new ErrorHandler("User not found", 404);

    res.status(200).json({
      success: true,
      message: "user found",
      user: { id: user.id, email: user.email, username: user.username, accessToken },
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Failed to find user", 404));
  }
};
