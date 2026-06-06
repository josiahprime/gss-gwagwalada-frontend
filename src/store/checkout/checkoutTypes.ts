// store/checkout/checkoutTypes.ts
export interface PaystackPaymentPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode?: string;
  state?: string;
  city?: string;
  landmark?: string;
  extraInstructions?: string;
  pickupStation?: string;
  deliveryType: "home" | "pickup";
  items: CheckoutRequestItem[];
}


export interface CheckoutRequestItem {
  productId: string;
  quantity: number;
  discountId?: string
}

export interface CheckoutRequestPayload {
  items: CheckoutRequestItem[];
}


export interface CheckoutItem {
  id: string;
  productName: string;
  priceInKobo: number;
  quantity: number;
  image: string;
  unitType: string;
}

export interface CheckoutState {
  isPaying: boolean;
  amount: number;
  email: string;
  phone: string;
  name: string;
  items: CheckoutRequestItem[];
  status: 'loading' | 'success' | 'error';
  message: string;

  currentStep: number;
  calculationDone: boolean;
}

export interface CheckoutActions {
  setAmount: (amount: number) => void;
  setItems: (items: CheckoutItem[]) => void;
  handlePaystackPayment: (payload: PaystackPaymentPayload) => Promise<void>; // 👈 modified
  verifyPayment: (reference: string) => Promise<void>;
   setCurrentStep: (step: number) => void;
   setCalculationDone: (value: boolean) => void;
}
