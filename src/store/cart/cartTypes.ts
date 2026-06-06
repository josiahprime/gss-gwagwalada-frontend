import type { Product } from "store/product/productTypes";

export interface CartItem {
  id: string;                // still string — fine for Zustand/UI
  userId?: string;           // user id as string (from backend)
  productId: string;         // product id as string
  productName: string;
  priceInKobo: number;
  image: string;
  quantity: number;
  unitType: string;
  discountId?: string | null;
  product?: Product;
  updating?: boolean; 
}

export interface CartState {
  items: CartItem[];       // logged-in user cart
  guestItems: CartItem[];  // guest-only cart
  isMerging: boolean;
  isLoading: boolean;
  cartMessage?: string | null;
  hasShownMessage?:boolean;
}


export interface CartActions {
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  mergeCart: () => Promise<void>; 
  getCart: () => Promise<void>
  clearCartMessage: () => void;
}
