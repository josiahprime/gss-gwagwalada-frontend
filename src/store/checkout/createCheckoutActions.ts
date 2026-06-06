

import { StateCreator } from "zustand";
import { CheckoutState, CheckoutActions } from "./checkoutTypes";
import { useCartStore } from "../cart/useCartStore";
import { axiosInstance } from "../../lib/axios";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const createCheckoutSlice: StateCreator<
  CheckoutState & CheckoutActions,
  [],
  [],
  CheckoutState & CheckoutActions
> = (set) => ({
  isPaying: false,
  amount: 0,
  email: "",
  phone: "",
  name: "",
  items: [],
  status: "loading",
  message: "",
  currentStep: 1,
  calculationDone: false,


  setAmount: (amount) => set({ amount }),
  setItems: (items) =>
    set({
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        discountId: undefined, // or item.discountId if it exists
      })),
    }),

    setCurrentStep: (step: number) => set({ currentStep: step }),
    setCalculationDone: (value: boolean) => set({ calculationDone: value }),



  // 🟢 Initiates Paystack payment
  handlePaystackPayment: async ({
    name,
    email,
    phone,
    address,
    postalCode,
    state,
    city,
    landmark,
    extraInstructions,
    pickupStation,
    deliveryType,
    items
  }) => {
    set({ isPaying: true });

    try {
      const response = await axiosInstance.post("/pay/paystack/initiate", {
        name,
        email,
        phone,
        address,
        postalCode,
        state,
        city,
        landmark,
        extraInstructions,
        pickupStation,
        deliveryType,
        items
      });

      const { authorization_url } = response.data.data;

      if (!authorization_url) {
        toast.error("Error initiating payment");
        return;
      }

      window.location.href = authorization_url;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Payment init error:", error);
      toast.error("Payment Failed");
    } finally {
      set({ isPaying: false });
    }
  },

  // 🟢 Verifies Paystack payment after redirect
  verifyPayment: async (reference: string) => {
    console.log("🔁 Verifying payment for reference:", reference);
    try {
      const response = await axiosInstance.get<{ status: string }>(
        `/pay/paystack/verify/${reference}`
      );

      console.log("✅ Payment verification response:", response.data);

      if (response.data.status === "paid") {
        useCartStore.getState().clearCart();
        toast.success("Payment Successful");

        set({
          status: "success",
          message: "Payment verified successfully!",
        });
      } else {
        console.warn("❌ Payment verification failed response:", response.data);
        set({
          status: "error",
          message: "Payment verification failed.",
        });
      }
    } catch (err: unknown) {
      console.error("❌ Error during payment verification:", err);

      let errorMessage = "Error verifying payment.";

      if (axios.isAxiosError(err)) {
        // safely access response.data.error if it exists
        const axiosError = err as AxiosError<{ error?: string }>;
        errorMessage = axiosError.response?.data?.error ?? errorMessage;
      }

      toast.error(errorMessage);

      set({
        status: "error",
        message: errorMessage,
      });
    }
  }
});

