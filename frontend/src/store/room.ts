import { Room } from "@/types/room";
import { create } from "zustand";

type RoomConnectionStatus =
  | "disconnected"
  | "connected"
  | "connecting"
  | "error";

interface RoomStore {
  roomConnectionStatus: RoomConnectionStatus;
  room: Room | null;
  error: string | null;
  setRoom: (room: Room | null) => void;
  getRoom: () => Room | null;
  setRoomConnectionStatus: (status: RoomConnectionStatus) => void;
  getRoomConnectionStatus: () => RoomConnectionStatus;
  setError: (error: string | null) => void;
  getError: () => string | null;
}

const useRoomStore = create<RoomStore>((set, get) => ({
  roomConnectionStatus: "disconnected",
  room: null,
  error: null,

  setRoomConnectionStatus: (status: RoomConnectionStatus) => {
    set(() => ({ roomConnectionStatus: status }));
  },

  getRoomConnectionStatus: () => get().roomConnectionStatus,

  setRoom: (room: Room | null) => {
    set(() => ({ room }));
  },

  getRoom: () => get().room,

  setError: (error: string | null) => {
    set(() => ({ error }));
  },

  getError: () => get().error,
}));

export default useRoomStore;
