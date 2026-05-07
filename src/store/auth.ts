import { create } from "zustand";
import { combine } from "zustand/middleware";
import type { AuthActions, AuthState } from "@/types/domain/auth";

export const useAuthStore = create(
  combine<AuthState, AuthActions>(
    {
      user: null,
      token: null,
    },
    (set, get) => ({
      getUser: () => get().user,
      getToken: () => get().token,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
  ),
);
