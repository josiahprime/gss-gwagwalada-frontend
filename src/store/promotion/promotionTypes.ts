// promotionTypes.ts
import type { Product } from "store/product/productTypes";
export interface Promotion {
  id: string;
  badgeText: string;
  headline: string;
  description: string;
  theme: "CHRISTMAS" | "BLACK_FRIDAY" | "VALENTINES" | "CUSTOM";
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage?: string;
  featureOnHomepage?: boolean;
  autoDeactivateOnExpire?: boolean;
  selectedProductIds: string[]; 
  createdAt: string;
  updatedAt: string;
}

export interface PromotionPreviewData {
  id: string;
  badgeText: string;
  headline: string;
  description: string;
  theme: Promotion["theme"];
  startDate: string;
  endDate: string;
  isActive: boolean;
  featureOnHomepage?: boolean;
  autoDeactivateOnExpire?: boolean;
  selectedProducts: Product[];
  createdAt: string;
  updatedAt: string;
}


export type CreatePromotionResponse = {
  success: boolean;
  promotion: Promotion;
};



// interface SelectedProduct {
//   id: string;
//   promotionId: string;
//   productId: string;
// }

export interface PromotionState {
  promotions: Promotion[];
  loading: boolean;
  error?: string;

  // Actions (required)
  fetchPromotions: () => Promise<void>;
  fetchPromotionById: (id: string) => Promise<Promotion | null>;
  createPromotion: (data: Partial<Promotion>) => Promise<void>;
  updatePromotion: (id: string, data: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
}

// Form data type only includes fields the user can edit
export type PromotionFormData = Omit<
  Promotion,
  "id" | "createdAt" | "updatedAt" | "selectedProducts"
> & { selectedProductIds: string[] };
