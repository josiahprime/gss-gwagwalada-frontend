import axios from "axios";
import { RecommendationState } from "./recommendationTypes";
import axiosInstance from "lib/axios";

type SetFunc = (
  state: Partial<RecommendationState> | ((state: RecommendationState) => Partial<RecommendationState>)
) => void;

export const createRecommendationActions = (set: SetFunc, _get: () => RecommendationState) => ({
  fetchRecommendations: async () => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.get("/recommendations");
      set({ recommendations: res.data, loading: false });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        set({ error: err.response.data?.error || "Failed to fetch recommendations", loading: false });
      } else {
        set({ error: "Failed to fetch recommendations", loading: false });
      }
    }
  },

  fetchTrending: async () => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.get("/recommendations/trending");
      set({ trending: res.data, loading: false });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        set({ error: err.response.data?.error || "Failed to fetch trending products", loading: false });
      } else {
        set({ error: "Failed to fetch trending products", loading: false });
      }
    }
  },

  fetchSimilar: async (productId: string) => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.get(`/recommendations/similar/${productId}`);
      set({ similar: res.data, loading: false });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        set({ error: err.response.data?.error || "Failed to fetch similar products", loading: false });
      } else {
        set({ error: "Failed to fetch similar products", loading: false });
      }
    }
  },

  clearRecommendations: () => {
    set({ recommendations: [], trending: [], similar: [], error: undefined });
  },
});
