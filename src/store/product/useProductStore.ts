// authStore.ts

import { create } from 'zustand';
import { ProductState} from './productTypes';
import { createProductActions } from './createProductActions';




export const useProductStore = create<ProductState>()(
  (...args) => ({
    // Initial state
    products: [],
    dailyDeals: [],
    HolidayDeals: [],
    popularProducts: [],
    favoriteProducts: [],
    favoriteIds: [],
    
    // Loading / status flags
    isCreatingProduct: false,
    isFetchingProducts: false, // keep if fetching favorite IDs separately
    isLoading: false,
    isUpdatingProduct: false,
    isFetchingMore: false,
    error: null,
    success: false,
    data: null,

    // Pagination
    nextCursor: null,
    hasMore: true,

    // Query object for search / category / filter
    query: {
      search: '',        // formerly searchQuery
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
    },

    // ✅ Track last fetched query to prevent redundant fetches
    lastFetchedQuery: null, // start as null, type: ProductQuery | null

    // Search-specific flags
    searchLoading: false,

    // Actions
    ...createProductActions(...args),
  })
);

