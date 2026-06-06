import { create } from "zustand";
import { PromotionState } from "./promotionTypes";
import { createPromotionActions } from "./createPromotionActions";

export const usePromotionStore = create<PromotionState>((set, get) => ({
  promotions: [],
  loading: false,
  error: undefined,
  ...createPromotionActions(set, get),
}));
