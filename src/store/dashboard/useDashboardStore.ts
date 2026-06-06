// store/dashboard/store.ts
import { create } from "zustand";
import { DashboardState, DashboardActions } from "./dashboardTypes";
import { createDashboardActions } from "./dashboardActions";

const initialState: DashboardState = {
  stats: null,
  featured: null,
  loading: false,
  error: null,

  // 👇 New initial state
  loadingFeatured: false,
  errorFeatured: null,

  // Monthly revenue state
  monthlyRevenue: [],
  loadingRevenue: false,
  errorRevenue: null,
};

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  (set) => ({
    ...initialState,
    ...createDashboardActions(set),
  })
);
