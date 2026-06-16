export interface EditableImage {
  id?: string;
  file?: File;
  url?: string;
  previewUrl?: string;
  index: number;
}

export interface Discount {
  id: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  label: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Product {
  id: string;
  productName: string;
  priceInKobo: number;
  description: string;
  stock: number;
  rating?: number;
  reviews?: string[];
  images: EditableImage[];
  category: string;
  tags: string[];
  unitType: string;
  isVariableWeight: boolean;
  minOrderQuantity: number;
  createdAt: string;
  updatedAt: string;
  // favorites: string[];
  isFavorite?: boolean;
  discountId?: string;
  discount?: Discount;
  displayLabel?: string;
  soldCount?: number; 
}

export interface Favorites {
  productIds: string[];
}


export interface DailyDeal{
  id: string;
  productName: string;
  description: string;
  priceInKobo: number;
  unitType: string;
  isFavorite?: boolean;
  discount: {
    value: number;
    type: 'PERCENTAGE' | 'FIXED';
    label: string;
    startDate: string;
    endDate: string;
  };
  images: {
    url: string;
  }[];
}

export interface HolidayDeals{
  id: string;
  productName: string;
  description: string;
  priceInKobo: number;
  unitType: string;
  isFavorite?: boolean;
  discount: {
    value: number;
    type: 'PERCENTAGE' | 'FIXED';
    label: string;
    startDate: string;
    endDate: string;
  };
  images: {
    url: string;
  }[];
}


export interface ProductFormData {
  id: string;
  productName: string;
  priceInKobo: number;
  description: string;
  stock: number;
  images: EditableImage[];
  category: string;
  tags: string[];
  unitType: string;
  isVariableWeight: boolean;
  minOrderQuantity: number;
  discountId?: string | null;
  displayLabel?: "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED";
}

export interface CreateProductPayload {
  productName: string;
  description: string;
  category: string;
  subCategory?: string;
  stock: number;
  priceInKobo: number;
  unitType: string;
  isVariableWeight: boolean;
  minOrderQuantity?: number;
  tags?: string[];
  images: EditableImage[];
  discountId?: string | null;
  displayLabel?: "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED";
}

export interface UpdateProductPayload {
  id: string;
  productName?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  stock?: number;
  priceInKobo?: number;
  unitType?: string;
  isVariableWeight?: boolean;
  minOrderQuantity?: number;
  tags?: string[];
  images?: (string | File)[];
  discountId?: string | null;
  displayLabel?: "NONE" | "POPULAR" | "DAILY_DEAL" | "NEW_ARRIVAL" | "FEATURED";
}

/** ✅ For single product endpoint response */
export interface SingleProductResponse {
  success: boolean;
  message?: string;
  product?: Product;
}


//remember whoever wants to work on this when im gone when ive crossed the bar
//i you want an item to show favorites and you dont add it to this product list
//youll debug for a year and it wont work...just saying hehe
export type ProductListKeys =
  | "products"
  | "popularProducts"
  | "favoriteProducts"
  | "dailyDeals"
  | "HolidayDeals";



  // export interface FetchProductsOptions {
  //     category?: string;
  //     minPrice?: number;
  //     maxPrice?: number;
  //   }

  //   export type FetchProductsFn = (
  //     filters?: FetchProductsOptions,
  //     cursor?: string,
  //     isFetchMore?: boolean,
  //     limit?: number
  //   ) => Promise<void>;


    






/** Store types */
export interface ProductSlice {
  products: Product[]
  singleProduct?: Product | null; // ✅ add this
  dailyDeals: Product[];
  HolidayDeals: Product[];
  popularProducts: Product[];
  favoriteProducts: Product[];
  favoriteIds: string[];  
  isCreatingProduct: boolean;
  isFetchingProducts: boolean;
  isLoading: boolean;
  isUpdatingProduct: boolean;
  error: string | null;
  success: boolean;
  data: unknown | null;
  nextCursor: string | null;
  hasMore: boolean;
  isFetchingMore: boolean,

  // 🔍 search
  // searchResults: Product[];
  // searchLoading: boolean;
  // searchQuery: string | null;
  // 🔎 unified query state
  query: ProductQuery;

  lastFetchedQuery: ProductQuery | null;

  


}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest";
}



/** Store actions */
export interface ProductActions {
  setFavoritesFor: (
    listKey: ProductListKeys,
    favoriteIds: string[]
  ) => void;


  createProduct: (data: CreateProductPayload) => Promise<void>;
  // fetchProducts: FetchProductsFn;

  /** ✅ New action for single product */
  // fetchProductById: (id: string) => Promise<void>;
  fetchProductById: (id: string, userId?: string) => Promise<void>;

  fetchDailyDeals: () => Promise<void>;
  fetchFavoriteIds: (userId: string) => Promise<string[]>;

  // setProductsWithFavorites(favoriteIds: string[])=>Promise<void>;
  fetchHolidayDeals: () => Promise<void>;
  fetchPopularProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateProduct: (payload: FormData) => Promise<{ success: boolean; message?: string }>;
  setProduct?: (product: Product) => void;
  fetchFavorites: (userId: string) => Promise<void>;
  trackView: (productId: string) => Promise<void>;
  toggleFavorite: (
    userId: string,
    productId: string
  ) => Promise<"added" | "removed">;


  fetchProducts: (options?: { loadMore?: boolean, caller?:string, category?: string; }) => Promise<void>;

  setCategory: (category: string) => void;
  setFilters: (filters: Partial<ProductQuery>) => void;


  /** 🔍 Search */
  setSearchQuery: (query: string) => void; // pass ""


  
}

/** Combined state */
export type ProductState = ProductSlice & ProductActions;
