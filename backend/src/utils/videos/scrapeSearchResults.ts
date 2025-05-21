import axios from "axios";
import { load } from "cheerio";
import { VideoData } from "../../types/video";

export async function scrapeSearchResults(
  query: string
): Promise<VideoData[] | undefined> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}`;
    const response = await axios.get(searchUrl);
    const $ = load(response.data);

    // Extract video details from inline JSON
    const scripts = $("script").toArray();
    let videoData: VideoData[] = [];

    for (const script of scripts) {
      const content = $(script).html();
      if (content?.includes("ytInitialData")) {
        // Extract JSON from script tag
        const jsonMatch = content.match(/ytInitialData\s*=\s*({.+?});/);
        if (!jsonMatch) return [];
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[1]);
          const videos =
            jsonData.contents.twoColumnSearchResultsRenderer.primaryContents
              .sectionListRenderer.contents[0].itemSectionRenderer.contents;

          for (let i = 0; i < 20; i++) {
            const item = videos[i];
            if (item.videoRenderer) {
                const title = item.videoRenderer.title.runs[0].text;
                const thumbnail = item.videoRenderer.thumbnail.thumbnails[0].url;
                const videoId = item.videoRenderer.videoId;
                videoData.push({ title, thumbnail, youtubeVideoId: videoId });
              }
          }
        }
        break;
      }
    }

    return videoData;
  } catch (error) {
    return undefined;
  }
}
