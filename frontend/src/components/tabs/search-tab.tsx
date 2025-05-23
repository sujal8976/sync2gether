import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader, Search } from "lucide-react";
import SearchCard from "../cards/search-card";
import { useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface VideoData {
  youtubeVideoId: string;
  thumbnail: string;
  title: string;
}

export default function SearchTab({ className }: { className?: string }) {
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const handleSearchVideos = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/videos?q=${input}`);

      if (response.data?.success) {
        setVideoData(response.data?.data);
      }
    } catch (error) {
      if (isAxiosError(error))
        toast.error(error.response?.data.message || "Failed to find videos");
      else toast.error("Failed to find videos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <Input
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Video URL or Search Video"
        />
        <Button
          size={"icon"}
          onClick={() => handleSearchVideos()}
          disabled={!input.trim() || isLoading}
        >
          <Search />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-6">
          <Loader className="animate-spin size-10" />
        </div>
      ) : (
        videoData &&
        videoData.map((data, i) => (
          <SearchCard
            key={i}
            youtubeVideoId={data.youtubeVideoId}
            thumbnail={data.thumbnail}
            title={data.title}
          />
        ))
      )}
    </div>
  );
}
