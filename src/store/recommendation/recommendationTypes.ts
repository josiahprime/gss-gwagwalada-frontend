// Types for your recommendation store
import type { Product } from "store/product/productTypes";




export interface RecommendationState {
  recommendations: Product[];
  trending: Product[];
  similar: Product[];
  loading: boolean;
  error?: string;
}

export interface RecommendationActions {
  fetchRecommendations: () => Promise<void>;
  fetchTrending: () => Promise<void>;
  fetchSimilar: (productId: string) => Promise<void>;
  clearRecommendations: () => void;
}
