// store/checkout/useCheckoutStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutState, CheckoutActions } from "./checkoutTypes";
import { createCheckoutSlice } from "./createCheckoutActions";

export const useCheckoutStore = create<CheckoutState & CheckoutActions>()(
  persist(
    (set, get, store) => createCheckoutSlice(set, get, store),
    {
      name: "checkout-store",
      partialize: (state) => ({
        currentStep: state.currentStep,
        calculationDone: state.calculationDone,
        // preview: state.preview, 
      })
    }
  )
);
