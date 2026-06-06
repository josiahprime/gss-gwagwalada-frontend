import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FormField =
  | "firstName"
  | "lastName"
  | "city"
  | "state"
  | "email"
  | "phone"
  | "address"
  | "extraInstructions"
  | "landmark"
  | "postalCode"
  | "pickupStation";

interface FormState {
  formData: Record<FormField, string>;
  setFormData: (data: Partial<Record<FormField, string>>) => void;
  resetFormData: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formData: {
        firstName: "",
        lastName: "",
        city: "",
        state: "",
        email: "",
        phone: "",
        address: "",
        landmark: "",
        extraInstructions: "",
        postalCode: "",
        pickupStation: "",
      },
      setFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      resetFormData: () =>
        set({
          formData: {
            firstName: "",
            lastName: "",
            city: "",
            state: "",
            email: "",
            phone: "",
            address: "",
            landmark: "",
            extraInstructions: "",
            postalCode: "",
            pickupStation: "",
          },
        }),
    }),
    {
      name: "checkout-form", // storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Optional: sync across tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "checkout-form" && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);
        if (newState?.state) {
          useFormStore.setState(newState.state);
          console.log("🔄 Form data synced across tabs:", newState.state);
        }
      } catch (error) {
        console.error("❌ Failed to sync form data:", error);
      }
    }
  });
}
