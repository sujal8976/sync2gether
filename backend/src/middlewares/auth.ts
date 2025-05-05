import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ErrorHandler("Unauthenticated or Token expired", 403, "token_expired");
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new ErrorHandler("Invalid or expired token", 401);
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return next(error);
    }
    return next(new ErrorHandler("Authentication failed", 401));
  }
};
