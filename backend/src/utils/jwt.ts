import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../db";
import ErrorHandler from "./ErrorHandler";

interface TokenPayload {
  userId: string;
}

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access_secret_key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"; // 7 days

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

export const generateRefreshToken = async (userId: string) => {
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });
  } catch (error) {
    throw new ErrorHandler("Error while creating new Refresh Token", 400);
  }

  return refreshToken;
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (
  token: string
): Promise<string | null> => {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.userId;
  } catch (error) {
    return null;
  }
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.delete({
    where: { token },
  });
};

export const deleteAllUserRefreshTokens = async (
  userId: string
): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

export const setAccessToken = (res: Response, accessToken: string): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

export const setRefreshToken = (res: Response, refreshToken: string): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAccessToken = (res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 0,
  });
};

export const clearRefreshToken = (res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 0,
  });
};
