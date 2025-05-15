import { create } from "zustand";
import { UserState } from "../types/user";

interface UserStore {
  user: UserState | null;
  setUser: (user: UserState) => void;
  removeUser: () => void;
  getUser: () => UserState | null;
  setAccessToken: (accessToken: string) => void;
  getAccessToken: () => string | null;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  setUser: (user: UserState) => {
    set(() => ({ user }));
  },

  removeUser: () => {
    set(() => ({ user: null }));
  },

  getUser: () => get().user,

  setAccessToken: (accessToken: string) => {
    const user = get().user;
    if (user) {
      set(() => ({ user: { ...user, accessToken } }));
    }
  },

  getAccessToken: () => get().user?.accessToken || null,
}));
