import { RoomState } from "@/types/room";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type RoomConnectionStatus = "disconnected" | "connected" | "connecting" | "error";

interface RoomStore {
  roomConnectionStatus: RoomConnectionStatus;
  room: RoomState | null;
  error: string | null;
  setRoom: (room: RoomState | null) => void;
  getRoom: () => RoomState | null;
  setRoomConnectionStatus: (status: RoomConnectionStatus) => void;
  getRoomConnectionStatus: () => RoomConnectionStatus;
  setError: (error: string | null) => void;
  getError: () => string | null;
}

const useRoomStore = create<RoomStore>()(
  devtools((set, get) => ({
    roomConnectionStatus: "disconnected",
    room: null,
    error: null,

    setRoomConnectionStatus: (status: RoomConnectionStatus) => {
      set(() => ({ roomConnectionStatus: status }));
    },

    getRoomConnectionStatus: () => get().roomConnectionStatus,

    setRoom: (room: RoomState | null) => {
      set(() => ({ room }));
    },

    getRoom: () => get().room,

    setError: (error: string | null) => {
      set(() => ({ error }));
    },

    getError: () => get().error,
  }))
);

export default useRoomStore;
