import api from "@/services/api";
import { RoomMember } from "@/types/room-member";
import { isAxiosError } from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RoomMembersStore {
  roomMembers: RoomMember[];
  isLoading: boolean;
  addRoomMember: (member: RoomMember) => void;
  addRoomMembers: (members: RoomMember[]) => void;
  removeRoomMember: (memberId: string) => void;
  getRoomMember: (memberId: string) => RoomMember | undefined;
  getRoomMembers: () => RoomMember[];
  clearAllMembers: () => void;
  fetchRoomMembers: (roomId: string) => Promise<void>;
  setUserOffline: (userId: string) => void;
  setUserOnline: (userId: string) => void;
}

const useRoomMembersStore = create<RoomMembersStore>()(
  devtools((set, get) => ({
    roomMembers: [],
    isLoading: false,

    addRoomMember: (member: RoomMember) => {
      set((state) => {
        const exists = state.roomMembers.some(
          (m) => m.userId === member.userId
        );
        if (exists) return state;
        return { roomMembers: [...state.roomMembers, member] };
      });
    },

    addRoomMembers: (members: RoomMember[]) => {
      set((state) => {
        const existingIds = new Set(state.roomMembers.map((m) => m.userId));
        const newMembers = members.filter((m) => !existingIds.has(m.userId));
        return { roomMembers: [...state.roomMembers, ...newMembers] };
      });
    },

    removeRoomMember: (memberId: string) => {
      set((state) => ({
        roomMembers: state.roomMembers.filter((m) => m.userId !== memberId),
      }));
    },

    getRoomMember: (memberId: string) => {
      return get().roomMembers.find((m) => m.userId === memberId);
    },

    getRoomMembers: () => {
      return get().roomMembers;
    },

    clearAllMembers: () => {
      set({ roomMembers: [] });
    },

    setUserOffline: (userId) => {
      set((state) => ({
        roomMembers: state.roomMembers.map((m) =>
          m.userId === userId ? { ...m, isOnline: false } : m
        ),
      }));
    },

    setUserOnline: (userId) => {
      set((state) => ({
        roomMembers: state.roomMembers.map((m) =>
          m.userId === userId ? { ...m, isOnline: true } : m
        ),
      }));
    },

    fetchRoomMembers: async (roomId: string) => {
      if (get().isLoading) return;

      set({ isLoading: true });

      try {
        const response = await api.get(`room-members/${roomId}`);

        if (response.status === 200) {
          get().addRoomMembers(response.data?.members);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || "Failed to get room members"
          );
        } else {
          throw new Error("Network error");
        }
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);

export default useRoomMembersStore;
