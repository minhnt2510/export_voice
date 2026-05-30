import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi from "../api/authApi";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthLoading: false,
      login: async (payload) => {
        set({ isAuthLoading: true });
        try {
          const { data } = await authApi.login(payload);
          set({ token: data.token, user: data.user, isAuthLoading: false });
          return data;
        } catch (error) {
          set({ isAuthLoading: false });
          throw error;
        }
      },
      register: async (payload) => {
        set({ isAuthLoading: true });
        try {
          const { data } = await authApi.register(payload);
          set({ token: data.token, user: data.user, isAuthLoading: false });
          return data;
        } catch (error) {
          set({ isAuthLoading: false });
          throw error;
        }
      },
      fetchMe: async () => {
        const token = get().token;

        if (!token) {
          return null;
        }

        const { data } = await authApi.me();
        set({ user: data.user });
        return data.user;
      },
      setUser: (user) => {
        set({ user });
      },
      setCredits: (credits) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                credits
              }
            : state.user
        }));
      },
      logout: () => {
        set({ token: null, user: null, isAuthLoading: false });
      }
    }),
    {
      name: "vivibe-auth"
    }
  )
);

export default useAuthStore;
