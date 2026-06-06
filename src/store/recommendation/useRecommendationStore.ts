import { create } from "zustand";
import { RecommendationState, RecommendationActions } from "./recommendationTypes";
import { createRecommendationActions } from "./createRecommendationActions";

export const useRecommendationStore = create<RecommendationState & RecommendationActions>((set, get) => ({
  recommendations: [],
  trending: [],
  similar: [],
  loading: false,
  error: undefined,

  ...createRecommendationActions(set, get)
}));
