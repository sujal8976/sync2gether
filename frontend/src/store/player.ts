import api from "@/services/api";
import { Video, PlayerState, VoteType } from "@/types/player";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { wsService } from "@/services/websocket";
import { WebSocketMessageType } from "@/types/websocket";

interface PlayerStore {
  // Current video state
  videoId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;

  // playlist state
  playlist: Video[];

  // actions
  fetchPlaylist: (roomId: string) => Promise<void>;
  setVideoId: (id: string | null) => void;
  setPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  addVideo: (video: Video) => void;
  removeVideo: (id: string) => void;
  playNextVideo: () => void;
  seekTo: (time: number) => void;

  voteVideo: (id: string, voteType: 1 | -1) => void;
  applyExternalVote: (
    playlistId: string,
    downvoteDelta: VoteType,
    upvoteDelta: VoteType
  ) => void;

  syncState: (state: PlayerState) => void;
}

const usePlayerStore = create<PlayerStore>()(
  devtools((set, get) => ({
    videoId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,

    playlist: [],

    fetchPlaylist: async (roomId: string) => {
      try {
        const data: { success: boolean; playlist: Video[] } = (
          await api.get(`/playlists?roomId=${roomId}`)
        ).data;
        if (data.success) {
          set({ playlist: data.playlist });
        }
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || "Failed to load playlist"
          );
        } else {
          throw new Error("Network error");
        }
      }
    },

    setVideoId: (id: string | null) => {},

    setPlaying: (isPlaying: boolean) => {},

    setCurrentTime: (duration: number) => {},

    setDuration: (duration: number) => {},

    addVideo: (video: Video) => {
      const existingVideo = get().playlist.find(
        (v) => v.youtubeVideoId === video.youtubeVideoId
      );
      if (existingVideo) return;
      set((state) => {
        return {
          playlist: [...state.playlist, video],
        };
      });
    },

    removeVideo: (id: string) => {},

    playNextVideo: () => {},

    seekTo: (time: number) => {},

    voteVideo: (id: string, voteType: 1 | -1) => {
      const prevPlaylist = get().playlist;
      const updatedPlaylist = handleVote(prevPlaylist, id, voteType);
      set({ playlist: updatedPlaylist });
    },

    applyExternalVote: (
      playlistId: string,
      downvoteDelta: VoteType,
      upvoteDelta: VoteType
    ) => {
      const updatedPlaylist = get().playlist.map((video) => {
        if (video.id !== playlistId) return video;

        return {
          ...video,
          upVote: video.upVote + upvoteDelta,
          downVote: video.downVote + downvoteDelta,
        };
      });

      set({ playlist: updatedPlaylist });
    },

    syncState: (state: PlayerState) => {},
  }))
);

export default usePlayerStore;

const handleVote = (
  playlist: Video[],
  playlistId: string,
  voteType: VoteType
): Video[] => {
  return playlist.map((video) => {
    if (video.id !== playlistId) return video;

    const isSameVote = video.userVote === voteType;
    const newVote: VoteType = isSameVote ? 0 : voteType;

    const upVote =
      video.upVote + (newVote === 1 ? 1 : 0) - (video.userVote === 1 ? 1 : 0);
    const downVote =
      video.downVote +
      (newVote === -1 ? 1 : 0) -
      (video.userVote === -1 ? 1 : 0);

    return {
      ...video,
      userVote: newVote,
      upVote,
      downVote,
    };
  });
};
