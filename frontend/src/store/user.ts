import { create } from "zustand";
import { User } from "../types/user";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
  getUser: () => User | null;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  setUser: (user: User) => {
    set(() => ({ user: user }));
  },

  removeUser: () => {
    set(() => ({ user: null }));
  },

  getUser() {
    return get().user;
  },
}));
