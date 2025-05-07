import * as ytdl from "@distube/ytdl-core";
import ErrorHandler from "../errors/ErrorHandler";
import { VideoData } from "../../types/video";

export const getVideoInfo = async (url: string): Promise<VideoData> => {
  try {
    const info = (await ytdl.getBasicInfo(url)).videoDetails;
    return {
      title: info.title,
      thumbnail: info.thumbnails[0].url,
      videoId: info.videoId,
    };
  } catch (error) {
    throw new ErrorHandler("VIdoe Info not found", 404);
  }
};
