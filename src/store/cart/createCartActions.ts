import { CartItem, CartState, CartActions } from './cartTypes';
import { axiosInstance } from 'lib/axios';
import { useAuthStore } from 'store/auth/useAuthStore';

export const createCartActions = (
  set: (partial: Partial<CartState> | ((state: CartState) => CartState)) => void,
  get: () => CartState
): CartActions => ({
  getCart: async () => {
    set({ isLoading: true });
    try {
      const authUser = useAuthStore.getState().authUser;

      if (authUser) {
        // Logged-in: fetch from backend and clear guest cart
        const res = await axiosInstance.get("/cart");
        if (!res.data || !Array.isArray(res.data.items)) {
          console.warn("Invalid cart response format");
          return;
        }

        console.log("response from get cart", res.data);

        set((state) => ({
          ...state,
          items: res.data.items,
          guestItems: [], // clear guest cart
          isMerging: false,
          isLoading: false,
          cartMessage: res.data.message || null,
          hasShownMessage: false 
        }));
      } else {
        // Guest: just keep existing guestItems
        set((state) => ({
          items: state.items,
          guestItems: state.guestItems, // preserve
          isMerging: false,
          isLoading: false
        }));
      }
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    }finally {
      set({ isLoading: false });
    }
  },

  clearCartMessage: () =>
  set({
    cartMessage: null,
    hasShownMessage: true
  }),



  addToCart: (item: CartItem) => {
    return new Promise<void>(async (resolve, reject) => {
      set({ isLoading: true });
      const authUser = useAuthStore.getState().authUser;
      const isLoggedIn = !!authUser;

      try {
        if (isLoggedIn) {
          await axiosInstance.post('/cart', { productId: item.productId, quantity: item.quantity || 1 });
        }

        set((state) => {
          const existingItem = isLoggedIn
            ? state.items.find(i => i.id === item.id)
            : state.guestItems.find(i => i.id === item.id);

          const updatedItems = existingItem
            ? (isLoggedIn
                ? state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i)
                : state.guestItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i)
              )
            : (isLoggedIn ? [...state.items, { ...item, quantity: item.quantity || 1 }] : [...state.guestItems, { ...item, quantity: item.quantity || 1 }]);

          return {
            ...state, 
            items: isLoggedIn ? updatedItems : state.items,
            guestItems: !isLoggedIn ? updatedItems : state.guestItems,
            isLoading: false,
          };
        });

        resolve(); // ✅ Resolve the Promise after state update
      } catch (err) {
        console.error('❌ Failed to add to cart:', err);
        set({ isLoading: false });
        reject(err);
      }
    });
  },




  removeFromCart: async (id: string) => {
    set({ isLoading: true });
    const authUser = useAuthStore.getState().authUser;
    const isLoggedIn = !!authUser;

    if (isLoggedIn) {
      try {
        await axiosInstance.delete(`/cart/${id}`);
      } catch (err) {
        console.error('❌ Failed to sync removeFromCart:', err);
      }

      set((state) => ({
        items: state.items.filter(item => item.id !== id),
        guestItems: state.guestItems, // preserve guest cart
        isMerging: false,
        isLoading: false,
      }));
    } else {
      // guest user: only update guestItems
      set((state) => ({
        guestItems: state.guestItems.filter(item => item.id !== id),
        items: state.items, // preserve logged-in items (usually empty)
        isMerging: false,
        isLoading: false,
      }));
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    const authUser = useAuthStore.getState().authUser;
    
    if (authUser) {
      try {
        await axiosInstance.delete('/cart/clear');
        set((state) => ({
          ...state,
          items: [],
          guestItems: state.guestItems,
          isMerging: false,
          isLoading: false,
        }));

      } catch (err) {
        console.error('❌ Failed to clear user cart:', err);
      }
    } else {
      set((state) => ({
        ...state,
        items: [],
        guestItems: state.guestItems,
        isMerging: false,
        isLoading: false,
      }));

      localStorage.removeItem('cart-storage');
    }
  },



  incrementQuantity: async (id: string) => {
    const authUser = useAuthStore.getState().authUser;
    const isLoggedIn = !!authUser;

    let updatedItem: CartItem | undefined;

    // mark item as updating and increment quantity
    set((state) => {
      if (isLoggedIn) {
        const updatedItems = state.items.map((item) => {
          if (item.id === id) {
            updatedItem = { ...item, updating: true, quantity: item.quantity + 1 };
            return updatedItem;
          }
          return item;
        });

        return { ...state, items: updatedItems };
      } else {
        const updatedGuestItems = state.guestItems.map((item) => {
          if (item.id === id) {
            updatedItem = { ...item, updating: true, quantity: item.quantity + 1 };
            return updatedItem;
          }
          return item;
        });

        return { ...state, guestItems: updatedGuestItems };
      }
    });

    // call backend
    if (isLoggedIn && updatedItem) {
      try {
        await axiosInstance.put(`/cart/${id}`, { quantity: updatedItem.quantity });
      } catch (err) {
        console.error('❌ Failed to update cart quantity:', err);
      } finally {
        // reset updating flag
        set((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.id === id ? { ...item, updating: false } : item
          ),
          guestItems: state.guestItems.map((item) =>
            item.id === id ? { ...item, updating: false } : item
          ),
        }));
      }
    } else {
      // guest user: reset updating immediately
      set((state) => ({
        ...state,
        guestItems: state.guestItems.map((item) =>
          item.id === id ? { ...item, updating: false } : item
        ),
      }));
    }
  },



  // decrementQuantity: async (id: string) => {
  //we never reset is updating to false here 
  //   const authUser = useAuthStore.getState().authUser;
  //   const isLoggedIn = !!authUser;

  //   let updatedItem: CartItem | undefined;

  //   // Update state synchronously
  //   set((state) => {
  //     if (isLoggedIn) {
  //       const updatedItems = state.items.map((item) => {
  //         if (item.id === id && item.quantity > 1) {
  //           updatedItem = { ...item, updating: true, quantity: item.quantity - 1 };
  //           return updatedItem;
  //         }
  //         return item;
  //       });

  //       return {
  //         items: updatedItems,
  //         guestItems: state.guestItems,
  //         isMerging: false,
  //         isLoading: false,
  //       };
  //     } else {
  //       const updatedGuestItems = state.guestItems.map((item) => {
  //         if (item.id === id && item.quantity > 1) {
  //           updatedItem = { ...item, updating: true, quantity: item.quantity - 1 };
  //           return updatedItem;
  //         }
  //         return item;
  //       });

  //       return {
  //         guestItems: updatedGuestItems,
  //         items: state.items,
  //         isMerging: false,
  //         isLoading: false,
  //       };
  //     }
  //   });

  //   // Call backend after state update
  //   if (isLoggedIn && updatedItem) {
  //     try {
  //       await axiosInstance.put(`/cart/${id}`, { quantity: updatedItem.quantity });
  //     } catch (err) {
  //       console.error('❌ Failed to update cart quantity:', err);
  //     }
  //   }
  // },

  decrementQuantity: async (id: string) => {
    const authUser = useAuthStore.getState().authUser;
    const isLoggedIn = !!authUser;

    let updatedItem: CartItem | undefined;

    // mark item as updating and adjust quantity
    set((state) => {
      if (isLoggedIn) {
        const updatedItems = state.items.map((item) => {
          if (item.id === id && item.quantity > 1) {
            updatedItem = { ...item, updating: true, quantity: item.quantity - 1 };
            return updatedItem;
          }
          return item;
        });
        return { items: updatedItems, guestItems: state.guestItems, isMerging: false, isLoading: false };
      } else {
        const updatedGuestItems = state.guestItems.map((item) => {
          if (item.id === id && item.quantity > 1) {
            updatedItem = { ...item, updating: true, quantity: item.quantity - 1 };
            return updatedItem;
          }
          return item;
        });
        return { guestItems: updatedGuestItems, items: state.items, isMerging: false, isLoading:false };
      }
    });

    // call backend
    if (isLoggedIn && updatedItem) {
      try {
        await axiosInstance.put(`/cart/${id}`, { quantity: updatedItem.quantity });
      } catch (err) {
        console.error('❌ Failed to update cart quantity:', err);
      } finally {
        // reset updating flag
        set((state) => ({
          ...state,
          items: state.items.map(item => item.id === id ? { ...item, updating: false } : item),
          guestItems: state.guestItems.map(item => item.id === id ? { ...item, updating: false } : item),
        }));
      }
    } else {
      // guest user: reset updating flag immediately
      set((state) => ({
        ...state,
        guestItems: state.guestItems.map(item => item.id === id ? { ...item, updating: false } : item),
        items: state.items,
      }));
    }
  },




  // mergeCart: async () => {
  //   set({ isLoading: true });
  //   const { guestItems } = get();
  //   const authUser = useAuthStore.getState().authUser;
  //   if (!authUser || guestItems.length === 0) return;

  //   set((state) => ({ ...state, isMerging: true }));

  //   try {
  //     await axiosInstance.post('/cart/merge', { items: guestItems });
  //     const res = await axiosInstance.get('/cart');
  //     set((state) => ({
  //       ...state,
  //       items: res.data.items,
  //       guestItems: [],
  //       isMerging: false,
  //       isLoading: false
  //     }));
  //     localStorage.removeItem('cart-storage');
  //   } catch (err) {
  //     console.error('Failed to merge cart:', err);
  //     set((state) => ({
  //       ...state,
  //       isMerging: false,
  //       isLoading: false
  //     }));
  //   }finally {
  //     set({ isLoading: false });
  //   }
  // }

  mergeCart: async () => {
    set({ isLoading: true });
    const { guestItems } = get();
    const authUser = useAuthStore.getState().authUser;
    if (!authUser || guestItems.length === 0) return;

    set({ isMerging: true });

    try {
      const res = await axiosInstance.post('/cart/merge', { items: guestItems });
      set({
        items: res.data.items,
        guestItems: [],
        isMerging: false,
        isLoading: false,
        cartMessage: res.data.message || null,
      });
      localStorage.removeItem('cart-storage');
    } catch (err) {
      console.error('Failed to merge cart:', err);
      set({ isMerging: false, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  }




});
