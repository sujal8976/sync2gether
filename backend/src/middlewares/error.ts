import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let code = err.code || undefined;

  if (process.env.NODE_ENV === "development")
    console.error(`[ERROR] ${statusCode} - ${message} - ${code ? code : ""}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    code,
  });
};

export default errorMiddleware;
