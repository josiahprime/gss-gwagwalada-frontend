import axios from "axios";
import { PromotionState, Promotion, CreatePromotionResponse } from "./promotionTypes";
import axiosInstance from "lib/axios";

type SetFunc = (
  state: Partial<PromotionState> | ((state: PromotionState) => Partial<PromotionState>)
) => void;

export const createPromotionActions = (set: SetFunc, _get: () => PromotionState) => ({
  fetchPromotions: async () => {
    set({ loading: true, error: undefined });
    try {

        const res = await axiosInstance.get("/promotions");
        console.log('promotions from backend',res.data)
        set({
          promotions: Array.isArray(res.data) ? res.data : [],
          loading: false,
        });


    } catch (err: unknown) {
        console.error(err)
      set({
        error: axios.isAxiosError(err) ? err.response?.data?.error ?? "Failed to fetch promotions" : "Failed to fetch promotions",
        loading: false,
      });
    }
  },

  fetchPromotionById: async (id: string) => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.get<Promotion>(`/promotions/${id}`);
      return res.data;
    } catch (err: unknown) {
      set({
        error: axios.isAxiosError(err) ? err.response?.data?.error ?? "Failed to fetch promotion" : "Failed to fetch promotion",
        loading: false,
      });
      return null;
    }
  },

  createPromotion: async (data: Partial<Promotion>) => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.post<CreatePromotionResponse>("/promotions", data);

      set((state) => {
        const nextPromotions = [res.data.promotion, ...state.promotions];
        return { promotions: nextPromotions, loading: false };
      });

    } catch (err: unknown) {
      set({
        error: axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Failed to create promotion"
          : "Failed to create promotion",
        loading: false,
      });
    }
  },


  updatePromotion: async (id: string, data: Partial<Promotion>) => {
    set({ loading: true, error: undefined });
    try {
      const res = await axiosInstance.put<Promotion>(`/promotions/${id}`, data);
      set((state) => ({
        promotions: state.promotions.map((p) => (p.id === id ? res.data : p)),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: axios.isAxiosError(err) ? err.response?.data?.error ?? "Failed to update promotion" : "Failed to update promotion",
        loading: false,
      });
    }
  },

  deletePromotion: async (id: string) => {
    set({ loading: true, error: undefined });
    try {
      await axiosInstance.delete(`/promotions/${id}`);
      set((state) => ({
        promotions: state.promotions.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err: unknown) {
      set({
        error: axios.isAxiosError(err) ? err.response?.data?.error ?? "Failed to delete promotion" : "Failed to delete promotion",
        loading: false,
      });
    }
  },
});
