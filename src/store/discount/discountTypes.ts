export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Discount {
  id: string;
  label: string;       // aligned with backend
  type: DiscountType;
  value: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface DiscountFormState {
  label: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const initialForm: DiscountFormState = {
  label: "",
  type: "PERCENTAGE",
  value: 0,
  startDate: "",
  endDate: "",
  isActive: true,
}

export interface DiscountState {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
  loadDummyDiscounts: () => void;
  fetchDiscounts: () => Promise<void>;
  addDiscount: (data: Omit<Discount, "id">) => Promise<void>;
  updateDiscount: (id: string, data: Partial<Discount>) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
}
