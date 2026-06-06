import { StateCreator } from "zustand";
import { LogActions, LogResponse, LogState } from "./logTypes";
import axiosInstance from "lib/axios";

const LIMIT = 20;

export const createLogActions: StateCreator<
  LogState & LogActions,
  [],
  [],
  LogActions
> = (set, get) => ({
  fetchInitialLogs: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get<LogResponse>("/logs", {
        params: { limit: LIMIT },
      });

      const data = res.data;

      set({
        logs: data.data,
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
        loading: false,
      });
    } catch {
      set({
        error: "Failed to load logs",
        loading: false,
      });
    }
  },

  fetchMoreLogs: async () => {
    const { loading, hasMore, nextCursor } = get();
    if (loading || !hasMore || !nextCursor) return;

    try {
      set({ loading: true });

      const res = await axiosInstance.get<LogResponse>("/logs", {
        params: {
          limit: LIMIT,
          cursor: nextCursor,
        },
      });

      const data = res.data;

      set((state) => ({
        logs: [...state.logs, ...data.data],
        nextCursor: data.nextCursor,
        hasMore: data.hasMore,
        loading: false,
      }));
    } catch {
      set({
        error: "Failed to load more logs",
        loading: false,
      });
    }
  },

  resetLogs: () => {
    set({
      logs: [],
      nextCursor: null,
      hasMore: true,
      error: null,
    });
  },
});
