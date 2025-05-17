import api from "@/services/api";
import { Chat, ChatResponse } from "@/types/chat";
import { isAxiosError } from "axios";
import { create } from "zustand";

interface ChatsStore {
  chats: Chat[];
  hasMore: boolean;
  isLoading: boolean;
  fetchChats: (roomId: string, page: number, limit: number) => Promise<void>;
  appendChats: (chats: Chat[]) => void;
  resetChatsStore: () => void;
  addChat: (chat: Chat) => void;
  replaceChat: (tempId: string, confirmedChat: Chat) => void;
}

const useChatsStore = create<ChatsStore>((set, get) => ({
  chats: [],
  hasMore: true,
  isLoading: false,

  fetchChats: async (roomId: string, page: number, limit: number) => {
    if (get().isLoading || !get().hasMore) return;

    set({ isLoading: true });
    try {
      const data: ChatResponse = (
        await api.get(`/chats?roomId=${roomId}&page=${page}&limit=${limit}`)
      ).data;
      
      if (data.success) {
        get().appendChats(data.chats);
        set({ hasMore: data.hasMore });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to load chats"
        );
      } else {
        throw new Error("Network error");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  appendChats: (newChats: Chat[]) => {
    set((state) => {
      return {
        chats: [...newChats, ...state.chats],
      };
    });
  },

  resetChatsStore: () => {
    set({
      chats: [],
      hasMore: true,
      isLoading: false,
    });
  },

  addChat: (chat: Chat) => {
    set((state) => {
      return {
        chats: [...state.chats, chat],
      };
    });
  },

  replaceChat: (tempId: string, confirmedChat: Chat) => {
    if (!tempId) return;
    set((state) => {
      const chats = [...state.chats];
      if (chats.length === 0) return { chats };

      for (let i = chats.length - 1; i >= 0; i--) {
        const chat = chats[i];
        if (chat && chat.id === tempId) {
          chats[i] = confirmedChat;
          break;
        }
      }

      return { chats };
    });
  },
}));

export default useChatsStore;
