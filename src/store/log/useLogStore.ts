import { create } from "zustand";
import { LogState, LogActions } from "./logTypes";
import { createLogActions } from "./CreateLogActions"

const initialState: LogState = {
  logs: [],
  loading: false,
  error: null,
  nextCursor: null,
  hasMore: true,
};

export const useLogStore = create<LogState & LogActions>()((set, get) => ({
  ...initialState,
  ...createLogActions(set, get),
}));
