import { create } from "zustand";
import type { UserDto } from "../types/user.dto";

interface UserState {
  user: UserDto | null;
  setUser: (user: UserDto) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));