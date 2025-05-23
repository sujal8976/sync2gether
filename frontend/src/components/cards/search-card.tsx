import { Check, Plus } from "lucide-react";
import { Button } from "../ui/button";
import useRoomStore from "@/store/room";
import api from "@/services/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import usePlayerStore from "@/store/player";
import { wsService } from "@/services/websocket";
import { WebSocketMessageType } from "@/types/websocket";

interface SearchCardProps {
  youtubeVideoId: string;
  thumbnail: string;
  title: string;
}

export default function SearchCard({
  youtubeVideoId,
  thumbnail,
  title,
}: SearchCardProps) {
  const roomId = useRoomStore().getRoom()?.roomId;
  if (!roomId) return;
  const addVideoToPlaylist = usePlayerStore().addVideo;
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddVideoToPlaylist = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = (
        await api.post("/playlists", {
          youtubeVideoId,
          title,
          roomId,
          thumbnail,
        })
      ).data;
      if (data.success) {
        wsService.send({
          type: WebSocketMessageType.VIDEO_ADDED,
          payload: {
            ...data.video,
            roomId,
          },
        });
        addVideoToPlaylist(data.video);
        toast.success("Video added to playlist");
        setIsAdded(true);
      }
    } catch (error) {
      if (isAxiosError(error))
        toast.error(
          error.response?.data.message || "Failed to add video in playlist"
        );
      else toast.error("Failed to add video in playlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark:bg-zinc-800 w-full flex p-2 rounded-lg gap-1">
      <img
        className="w-[20%] min-w-19 h-[55px] md:h-15 object-cover rounded-sm"
        src={thumbnail}
        alt=""
      />
      <div className="flex-1 flex flex-col h-[55px] md:h-15">
        <h3 className="truncate-text">{title}</h3>
      </div>
      <div className="flex justify-center items-center">
        {isAdded ? (
          <Button disabled>
            Added <Check />
          </Button>
        ) : (
          <Button onClick={() => handleAddVideoToPlaylist()}>
            Add <Plus />
          </Button>
        )}
      </div>
    </div>
  );
}
