import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errors/ErrorHandler";
import { VideoData } from "../types/video";
import { scrapeSearchResults } from "../utils/videos/scrapeSearchResults";
import { getVideoInfo } from "../utils/videos/getVideoInfo";

export const searchVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new ErrorHandler("Not Authenticated", 401);

    const query = req.query.q?.toString();
    if (!query)
      throw new ErrorHandler("Query is required to search videos.", 400);

    let videoDatas: any[] = [];

    if (
      query.startsWith("https://www.youtube.com/") ||
      query.startsWith("youtube.com") ||
      query.startsWith("https://youtu.be/")
    ) {
      videoDatas.push(await getVideoInfo(query));
    } else {
      videoDatas = (await scrapeSearchResults(query)) as VideoData[];
    }

    if (videoDatas === undefined || videoDatas.length === 0)
      throw new ErrorHandler("Videos not found", 404);

    res.status(200).json({
      success: true,
      data: videoDatas,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler("Video not found", 500));
  }
};
