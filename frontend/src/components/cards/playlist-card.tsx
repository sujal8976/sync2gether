import { cn } from "@/lib/utils";
import api from "@/services/api";
import { wsService } from "@/services/websocket";
import usePlayerStore from "@/store/player";
import useRoomStore from "@/store/room";
import { useUserStore } from "@/store/user";
import { VoteType } from "@/types/player";
import { WebSocketMessageType } from "@/types/websocket";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

interface PlaylistCardProps {
  playlistId: string;
  title: string;
  thumbnail: string;
  addedBy: string; // username of who added this video
  upVote: number; // total of 1
  downVote: number; // total of -1
  userVote: VoteType; // 1 | 0 | -1
}

export default function PlaylistCard({
  playlistId,
  title,
  addedBy,
  thumbnail,
  upVote,
  downVote,
  userVote,
}: PlaylistCardProps) {
  const voteVideo = usePlayerStore().voteVideo;

  const handleVote = async (playlistId: string, voteType: 1 | -1) => {
    try {
      const status = (
        await api.post("/votes", {
          playlistId,
          voteType,
        })
      ).status;

      if (status === 200 || status === 201) {
        const { downvoteDelta, upvoteDelta } = calculateVoteDeltas(
          userVote,
          voteType
        );
        wsService.send({
          type: WebSocketMessageType.VOTE,
          payload: {
            userId: useUserStore.getState().getUser()?.id,
            playlistId,
            roomId: useRoomStore.getState().getRoom()?.roomId,
            downvoteDelta,
            upvoteDelta,
          },
        });

        voteVideo(playlistId, voteType);
      }
    } catch (error) {
      toast.error("Failed to upvote or downvote video");
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
        <p className="truncate-text text-sm">
          Added by: <span className="">{addedBy}</span>
        </p>
      </div>
      <div className="w-[20%] min-w-19 flex justify-center items-center gap-1">
        <span className="flex items-center">
          <ArrowBigUp
            onClick={() => handleVote(playlistId, 1)}
            className={cn(userVote === 1 && "dark:fill-white fill-black")}
          />{" "}
          {upVote}
        </span>
        <span className="flex items-center">
          <ArrowBigDown
            onClick={() => handleVote(playlistId, -1)}
            className={cn(userVote === -1 && "dark:fill-white fill-black")}
          />{" "}
          {downVote}
        </span>
      </div>
    </div>
  );
}

const calculateVoteDeltas = (currentUserVote: VoteType, newVoteType: 1 | -1) => {
  let upvoteDelta = 0;
  let downvoteDelta = 0;
  
  // Determine final vote state (toggle off if clicking same vote)
  const finalVoteState: VoteType = currentUserVote === newVoteType ? 0 : newVoteType;
  
  // Remove current vote effect
  if (currentUserVote === 1) {
    upvoteDelta -= 1;
  } else if (currentUserVote === -1) {
    downvoteDelta -= 1;
  }
  
  // Add final vote effect
  if (finalVoteState === 1) {
    upvoteDelta += 1;
  } else if (finalVoteState === -1) {
    downvoteDelta += 1;
  }
  
  return { upvoteDelta, downvoteDelta };
 };
