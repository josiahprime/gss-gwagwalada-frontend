import axiosInstance from "lib/axios";
import { DiscountState, Discount } from "./discountTypes";
import { AxiosError } from "axios";

export const createDiscountActions = (
  set: (
    partial:
      | Partial<DiscountState>
      | ((state: DiscountState) => Partial<DiscountState>)
  ) => void,
  get: () => DiscountState
) => ({
  discounts: [] as Discount[],
  loading: false,
  error: null as string | null,

  // 🔹 Fetch all discounts
  fetchDiscounts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/discounts");
      console.log(res)
      set({ discounts: res.data.discounts || [], loading: false });
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Failed to fetch discounts:", err);
      set({
        loading: false,
        error: error.response?.data?.error || "Failed to fetch discounts",
      });
    }
  },

  // 🔹 Add new discount (optimistic)
  addDiscount: async (data: Omit<Discount, "id">) => {
    set({ loading: true, error: null });

    const optimistic: Discount = {
      ...data,
      id: `temp-${Math.random().toString(36).substr(2, 9)}`,
    };

    set((state) => ({ discounts: [optimistic, ...state.discounts] }));

    try {
      await get().fetchDiscounts();
      set({ loading: false });

    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Failed to add discount:", err);
      set((state) => ({
        discounts: state.discounts.filter((d) => d.id !== optimistic.id),
        loading: false,
        error: error.response?.data?.error || "Failed to add discount",
      }));
    }
  },

  // 🔹 Update
  updateDiscount: async (id: string, data: Partial<Discount>) => {
    set({ loading: true, error: null });

    const prevDiscount = get().discounts.find((d) => d.id === id);
    if (!prevDiscount) {
      set({ loading: false, error: "Discount not found" });
      return;
    }

    // Optimistic update
    set((state) => ({
      discounts: state.discounts.map((d) =>
        d.id === id ? { ...d, ...data } : d
      ),
    }));

    try {
      await axiosInstance.patch(`/discounts/${id}`, data);
      set({ loading: false });
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Failed to update discount:", err);
      set((state) => ({
        discounts: state.discounts.map((d) =>
          d.id === id ? prevDiscount : d
        ),
        loading: false,
        error: error.response?.data?.error || "Failed to update discount",
      }));
    }
  },

  // 🔹 Delete
  deleteDiscount: async (id: string) => {
    set({ loading: true, error: null });

    const prevDiscounts = get().discounts;
    set((state) => ({
      discounts: state.discounts.filter((d) => d.id !== id),
    }));

    try {
      await axiosInstance.delete(`/discounts/${id}`);
      set({ loading: false });
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Failed to delete discount:", err);
      set({
        discounts: prevDiscounts,
        loading: false,
        error:
          error.response?.data?.error || "Failed to delete discount",
      });
    }
  },

  // 🔹 Dummy data for testing UI without backend
  loadDummyDiscounts: () =>
    set({
      discounts: [
        {
          id: "1",
          label: "Christmas Promo",
          type: "PERCENTAGE",
          value: 15,
          isActive: true,
          startDate: "2025-12-01",
          endDate: "2025-12-31",
        },
        {
          id: "2",
          label: "New Year Sale",
          type: "FIXED",
          value: 5000,
          isActive: false,
          startDate: "2025-12-31",
          endDate: "2026-01-05",
        },
      ],
      loading: false,
      error: null,
    }),
});
