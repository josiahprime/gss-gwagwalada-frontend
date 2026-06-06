// store/dashboard/actions.ts
import axiosInstance from "lib/axios";
import { DashboardActions, DashboardState, MonthlyRevenue } from "./dashboardTypes";

export const createDashboardActions = (
  set: (fn: (state: DashboardState) => DashboardState) => void
): DashboardActions => ({
  fetchStats: async () => {
    console.log("fetching stats....");
    set((state) => ({ ...state, loading: true, error: null }));

    try {
      const res = await axiosInstance.get("/admin/stats");
      console.log('fetch stats response', res)

      set((state) => ({
        ...state,
        stats: res.data,
        loading: false,
        error: null,
      }));
    } catch (err: any) {
      set((state) => ({
        ...state,
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch dashboard stats",
      }));
    }
  },

  fetchMonthlyRevenue: async () => {
    console.log("fetching monthly revenue...");
    set((state) => ({
      ...state,
      loadingRevenue: true,
      errorRevenue: null,
    }));

    try {
      const res = await axiosInstance.get("/revenue/monthly"); // your backend endpoint
      console.log('monthly revenue from zustand',res)
      const data: MonthlyRevenue[] = res.data.data;

      set((state) => ({
        ...state,
        monthlyRevenue: data,
        loadingRevenue: false,
        errorRevenue: null,
      }));
    } catch (err: any) {
      set((state) => ({
        ...state,
        loadingRevenue: false,
        errorRevenue: err?.response?.data?.message || "Failed to fetch monthly revenue",
      }));
    }
  },

  fetchFeatured: async () => {
    console.log('fetching featured...')
    // Set loading and reset error specifically for featured
    set((state) => ({
      ...state,
      loadingFeatured: true,
      errorFeatured: null,
    }));

    try {
      const res = await axiosInstance.get("/admin/stats/featured-stats");
      console.log("featured stats response", res);

      set((state) => ({
        ...state,
        featured: res.data, 
        loadingFeatured: false,
        errorFeatured: null,
      }));
    } catch (err: any) {
      set((state) => ({
        ...state,
        loadingFeatured: false,
        errorFeatured:
          err?.response?.data?.message || err.message || "Failed to load featured stats",
      }));
    }
  },


});
