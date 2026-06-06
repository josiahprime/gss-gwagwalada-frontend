// createProductActions.ts
import { StateCreator } from 'zustand';
import toast from 'react-hot-toast';
import { AxiosError } from "axios";
import { applyFavorites } from 'utils/applyFavorites';
import { axiosInstance } from '../../lib/axios';
import {
  ProductSlice,
  ProductActions,
  CreateProductPayload,
  ProductListKeys
} from './productTypes';


// let DEBUG_FETCH_COUNT = 0;
// const DEBUG_FETCH_LIMIT = 3;


export const createProductActions: StateCreator<
  ProductSlice & ProductActions,
  [],
  [],
  ProductActions
> = (set, get) => ({

  


  setProduct: (product) => {
    // Optionally store a selected or active product (if needed)
    console.log('Product set:', product);
  },

  createProduct: async (payload: CreateProductPayload) => {
    set({ isLoading: true, error: null, success: false });
    // console.log("🚀 Starting product creation...");

    try {
      const data = new FormData();

      // append product info
      data.append("productName", payload.productName);
      data.append("description", payload.description);
      data.append("category", payload.category);

      if (payload.subCategory) data.append("subCategory", payload.subCategory);
      data.append("priceInKobo", String(payload.priceInKobo));
      data.append("stock", String(payload.stock));
      data.append("unitType", payload.unitType);
      data.append("isVariableWeight", String(payload.isVariableWeight));
      if (payload.minOrderQuantity) data.append("minOrderQuantity", String(payload.minOrderQuantity));
      if (payload.tags && payload.tags.length > 0) data.append("tags", JSON.stringify(payload.tags));
      if (payload.discountId) data.append("discountId", payload.discountId);
      if (payload.displayLabel) data.append("displayLabel", payload.displayLabel);

      payload.images.forEach((img) => {
        if (img.file instanceof File) data.append("images", img.file);
      });

      // API request
      const response = await axiosInstance.post("/products/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ isLoading: false, success: true });
      console.log("✅ Product created:", response.data);

      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("❌ Product creation failed:", err);
      set({
        isLoading: false,
        error: error.response?.data.error || "Failed to create product",
      });
      throw err; // re-throw so the component can handle toast/error
    }
  },


  updateProduct: async (payload: FormData) => { 
    set({ isUpdatingProduct: true });
    try {
      const id = payload.get("id") as string;
      const res = await axiosInstance.put(`/products/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ data: res.data });
      return { success: true };
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return { success: false, message: error.response?.data?.error || "Item update failed" };
    } finally {
      set({ isUpdatingProduct: false });
    }
  },

  




  fetchProducts: async ({ loadMore = false, caller } = {}) => {
    const state = get();

    if (state.error) return;

    if (!loadMore) {
      const currentQuery = state.query;

      // block if already fetched this query
      if (state.lastFetchedQuery && JSON.stringify(state.lastFetchedQuery) === JSON.stringify(currentQuery)) {
        console.log(`[STORE] fetch blocked: already fetched query for ${caller}`);
        return;
      }

      // update lastFetchedQuery before making the request
      set({ lastFetchedQuery: currentQuery });
    }

    if (loadMore) {
      if (state.isFetchingMore || !state.hasMore || !state.nextCursor) return;
      set({ isFetchingMore: true });
    } else {
      set({ isLoading: true });
    }

    console.log("[STORE] fetch start", {
      productsLength: get().products.length,
      lastFetchedQuery: get().lastFetchedQuery,
      query: get().query,
      loadMore,
    });

    try {
      const { query, nextCursor } = get();

      const params = new URLSearchParams({
        limit: "12",
        ...(query.category && { category: query.category }),
        ...(query.search && { q: query.search }),
        ...(query.minPrice && { minPrice: query.minPrice.toString() }),
        ...(query.maxPrice && { maxPrice: query.maxPrice.toString() }),
        ...(query.sort && { sort: query.sort }),
        ...(loadMore && nextCursor && { cursor: nextCursor }),
      }).toString();

      const endpoint = query.search
        ? `/products/search?${params}`
        : `/products/get-products?${params}`;

      const { data } = await axiosInstance.get(endpoint);

      console.log("[STORE] fetch success", {
        productsLength: data.products.length,
        query: get().query,
      });

      set((state) => ({
        products: loadMore
          ? [...state.products, ...data.products]
          : data.products,
        nextCursor: data.nextCursor ?? null,
        hasMore: Boolean(data.nextCursor),
        isLoading: false,
        isFetchingMore: false,
        error: null,
      }));

      console.log("[STORE] after set", {
        productsLength: get().products.length,
        lastFetchedQuery: get().lastFetchedQuery,
        nextCursor: get().nextCursor,
        hasMore: get().hasMore,
        isLoading: get().isLoading,
        isFetchingMore: get().isFetchingMore,
      });

    } catch (err) {
      set({
        isLoading: false,
        isFetchingMore: false,
        hasMore: false,
        error: "Failed to load products",
      });
    }
  },



  setSearchQuery: (search) =>
  set((state) => ({
    query: { ...state.query, search },
  })),

  // setCategory: (category) =>
  // set((state) => ({
  //   query: { ...state.query, category },
  // })),

  setCategory: (category) =>
  set((state) => ({
    query: {
      ...state.query,
      category,
      minPrice: undefined,
      maxPrice: undefined,
    },
  })),




  

  setFilters: (filters) =>
  set((state) => ({
    query: {
      ...state.query,
      ...filters,
    },
  })),








  fetchProductById: async (id: string, userId?: string) => {
    try {
      set({ isLoading: true, error: null });

      const query = userId ? `?userId=${userId}` : "";
      const res = await axiosInstance.get(`/products/${id}${query}`);

      const product = res.data?.product;
      if (!product) throw new Error("Product not found");

      set({ singleProduct: product, success: true });
      return product;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      console.error("Error fetching product by ID:", err);

      set({
        error: error.message || "Failed to fetch product details",
        singleProduct: null,
        success: false,
      });

      return null;
    } finally {
      set({ isLoading: false });
    }
  },






  

  deleteProduct: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success('Item deleted successfully');
      return true;
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || 'Item delete failed');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

 fetchFavorites: async (userId: string) => {
  set({ isLoading: true, error: null });
  try {
    const { data } = await axiosInstance.get(`/products/favorites/${userId}`);
    console.log('favorites from fetch favorites function',data)
    set({ favoriteProducts: data, isLoading: false });
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;
    set({ error: error.message, isLoading: false });
  }
},

toggleFavorite: async (userId: string, productId: string) => {
  try {
    const { data } = await axiosInstance.post(`/products/favorites/toggle`, { userId, productId });
    console.log("toggle favorite response:", data);

    set((state) => {
      const { favoriteIds, favoriteProducts } = state;

      if (data.status === "added") {
        return {
          favoriteIds: [...favoriteIds, productId],
          favoriteProducts: [...favoriteProducts, data.product],
        };
      } else {
        return {
          favoriteIds: favoriteIds.filter(id => id !== productId),
          favoriteProducts: favoriteProducts.filter(p => p.id !== productId),
        };
      }
    });

    const result = data.status === "added" ? "added" : "removed";
    console.log("final return value from toggleFavorite:", result);
    return result;
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;
    set({ error: error.message });
    return "removed";
  }
},

// fetchFavoriteIds: async (userId: string) => {
//   if (!userId) return;
//   set({ isFetchingProducts: true, error: null });

//   try {
//     const { data } = await axiosInstance.get(`/products/${userId}/favorites/ids`);

//     set((state) => ({
//       favoriteIds: data.favoriteIds || [],
//       isFetchingProducts: false,
//     }));

//     console.log("Fetched favorite IDs:", data.favoriteIds);
//   } catch (err) {
//     const error = err as AxiosError<{ error: string }>;
//     set({ error: error.message, isFetchingProducts: false });
//     console.error("Failed to fetch favorite IDs:", err);
//   }
// },

fetchFavoriteIds: async (userId: string): Promise<string[]> => {
  if (!userId) return [];
  set({ isFetchingProducts: true, error: null });

  try {
    const { data } = await axiosInstance.get(`/products/${userId}/favorites/ids`);
    set((_state) => ({
      favoriteIds: data.favoriteIds || [],
      isFetchingProducts: false,
    }));
    console.log("Fetched favorite IDs:", data.favoriteIds);
    return data.favoriteIds || []; // ✅ return them
  } catch (err) {
    const error = err as AxiosError<{ error: string }>;
    set({ error: error.message, isFetchingProducts: false });
    console.error("Failed to fetch favorite IDs:", err);
    return [];
  }
},




setFavoritesFor: (listKey: ProductListKeys, favoriteIds: string[]) =>
  set(state => {
    // Type assertion: state[listKey] is an array of objects with `id`
    const list = state[listKey] as unknown as { id: string }[] | null | undefined;
    return {
      ...state,
      [listKey]: applyFavorites(list, favoriteIds),
    };
  }),









  

  fetchDailyDeals: async () => {
    console.log('fetching daily deals from zustand')
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/products/daily-deals');
      console.log('request sent now response is ', response)
      console.log('fetch daily deals res', response)
      set({ dailyDeals: response.data.dailyDeals, isLoading: false });
    } catch (err) {
      console.log('daily deals fetch error:', err);

      const error = err as AxiosError<{ error: string }>;
      set({ isLoading: false, error: error.message });
    }
  },

  fetchHolidayDeals: async () => {
    console.log("Fetching holiday deals from Zustand...");
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosInstance.get("/products/holiday-deals");
      console.log("Holiday deals response:", response.data);
      set({ HolidayDeals: response.data.HolidayDeals, isLoading: false });
    } catch (err) {
      console.error("Error fetching holiday deals:", err);
      const error = err as AxiosError<{ error: string }>;
      set({ isLoading: false, error: error.message });
    }
  },

  fetchPopularProducts: async () => {
    console.log('fetching Products')
    set({ isLoading: true, error: null });
      try {
        const response = await axiosInstance.get('/products/popular-products');
        console.log('fetch popular products res', response)
        set({ popularProducts: response.data.popularProducts, isLoading: false });
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        set({ isLoading: false, error: error.message });
      }  
  },


  trackView: async (productId: string) => {
    set({ isLoading: true, error: undefined });

    try {
      await axiosInstance.post(`/products/${productId}/view`);
      set({ isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      const msg =
        error.response?.data?.error ||
        "Failed to record product view";

      set({ error: msg, isLoading: false });
    }
  },
});


