import { CartItem } from "store/cart/cartTypes";

export type OrderStatus =
  | "pending"
  | "paid"
  | "Out for Delivery"
  | "completed"
  | "failed"
  | "cancelled"
  | "success";

export type FulfillmentStatus =
  | "Processing"
  | "Shipped"
  | "OutForDelivery"
  | "Delivered";

export interface OrderPreview {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
}

export interface Order {
  id: string;
  tx_ref: string;
  trackingId: string;
  userId: string;
  items: OrderItem[];
  name: string;
  email: string;
  amount: number;
  status: OrderStatus;
  
  fulfillmentStatus: FulfillmentStatus;
  deliveryType: string;
  deliveryProvider: string;
  deliveryTrackingUrl: string;
  createdAt: string;

  pricing:{
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  };

  shipping: {
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    landmark: string;
    pickupStation: string;
    extraInstructions: string;
  };
}

export interface OrderItem {
  productName: string;
  originalPriceInKobo: number,   // store original price
  unitPriceInKobo: number,       // store price after discount
  discountAppliedInKobo: number, // discount applied safely
  priceInKobo: number;
  quantity: number;
  unitType?: string;
  image: {
    id: string;
    url: string;
    index: number;
    publicId: string;
    createdAt: string;
    productId: string;
  };
  deliveryType: string;
  productId: string;
  discountId: string | null;
  estimatedDeliveryStart?: string,
  estimatedDeliveryEnd?: string,
}









export interface UserOrder {
  id: string;
  
  trackingId: string;
  createdAt: string; // or Date, depending on your usage
  fulfillmentStatus: string;
  items: OrderItem[];
}


export interface OrderState {
  orders: Order[];
  cartItems: CartItem[]
  userOrders: UserOrder[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  preview: OrderPreview | null;
}

interface UpdateFulfillmentStatusPayload {
  status: string,
  fulfillmentStatus: FulfillmentStatus;
}

export interface OrderActions {
  fetchOrders: () => Promise<void>;
  getUserOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrder: (id: string, payload: UpdateFulfillmentStatusPayload) => Promise<boolean>;
  resetOrders: () => void;
  filterOrdersByStatus: (status: OrderStatus) => Order[];
   previewOrder: (cartItems: CartItem[], userAddress: { state: string; city: string }, deliveryType: string) => Promise<OrderPreview>;
}
