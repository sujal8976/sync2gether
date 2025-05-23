import { cn } from "@/lib/utils";
import PlaylistCard from "../cards/playlist-card";
import usePlayerStore from "@/store/player";

export default function PlaylistTab({ className }: { className?: string }) {
  const playlist = usePlayerStore().playlist;

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {playlist.map((video) => (
        <PlaylistCard
          key={video.id}
          playlistId={video.id}
          thumbnail={video.thumbnail}
          addedBy={video.addedBy}
          downVote={video.downVote}
          upVote={video.upVote}
          title={video.title}
          userVote={video.userVote}
        />
      ))}
    </div>
  );
}
