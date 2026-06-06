'use client'
import { formatCurrency } from "utils/FormatCurrency";
import {useCartStore} from "../../../store/cart/useCartStore";
import { useAuthStore } from "store/auth/useAuthStore";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight} from "lucide-react";
import { useCheckoutStore } from "store/checkout/useCheckoutStore";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import CartSkeleton from "app/components/ui/CartSkeleton";
import EmptyCart from "app/components/ui/EmptyCart";





const CartPage = () => {
//Retrieve cart state and actions from Zustand
  const getCart = useCartStore((state)=>state.getCart)
  const AuthUserCart = useCartStore((state) => state.items);
  const guestCart = useCartStore((state)=>state.guestItems)
  const authUser = useAuthStore((state)=>state.authUser)
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartMessage = useCartStore((state)=>state.cartMessage);
  const clearCartMessage = useCartStore((state)=>state.clearCartMessage)
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);



  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
      const fetchCart = async () => {
        setIsLoading(true);
        await getCart();
        setIsLoading(false);
      };
      fetchCart();
    }, [authUser, getCart]);

    useEffect(() => {
      if (cartMessage) {
        toast(cartMessage);     // Show notification
        clearCartMessage();     // Clear message so it doesn't repeat
      }
    }, [cartMessage, clearCartMessage]);

    useEffect(() => {
      useCheckoutStore.getState().setCurrentStep(1); 
      localStorage.removeItem("checkout-store"); 
    }, []);


    
    


  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && authUser) {
        try {
          console.log("🔄 Tab focused — refreshing cart...");
          await getCart();
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("❌ Failed to refresh cart on tab focus:", err);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [authUser, getCart]);

  const handleRemove = (id: string, productName: string) => {
    removeFromCart(id);
    toast.success(`${productName} removed from cart.`);
  };


  if (isLoading) return <CartSkeleton />;



  
  // console.log(cartItems)
  // console.log("cartItems value:", cartItems);
  // console.log("Type of cartItems:", typeof cartItems);
  // console.log("Is Array?", Array.isArray(cartItems));
  // console.log("Keys (if object):", cartItems && typeof cartItems === "object" ? Object.keys(cartItems) : null);
  // whichever set applies
  const cartItems = authUser ? AuthUserCart : guestCart;

  const total = cartItems.reduce((sum, item) => sum + item.priceInKobo * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  



  if (cartItems.length === 0) {
    return <EmptyCart/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-2 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-sm text-gray-600">
                  {totalItems} item{totalItems > 1 ? 's' : ''} • {formatCurrency(total)}
                </p>
              </div>
            </div>

            <button
              onClick={clearCart}
              className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-300 border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table Section */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-b border-gray-200">
                      <th className="text-left py-6 px-6 font-semibold text-gray-700">#</th>
                      <th className="text-left py-6 px-6 font-semibold text-gray-700">Product</th>
                      <th className="text-center py-6 px-6 font-semibold text-gray-700">Price</th>
                      <th className="text-center py-6 px-6 font-semibold text-gray-700">Quantity</th>
                      <th className="text-center py-6 px-6 font-semibold text-gray-700">Total</th>
                      <th className="text-center py-6 px-6 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-indigo-50/30 transition-all duration-200">
                        <td className="py-6 px-6">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center space-x-4">
                            {/* <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                              <img 
                                src={item.image} 
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div> */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-md">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                className="object-cover"
                                width={64}      // match your div width
                                height={64}     // match your div height
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{item.productName}</h3>
                              <p className="text-gray-500 text-sm">Premium Quality</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-6 text-center">
                          <span className="text-lg font-bold text-gray-800">{formatCurrency(item.priceInKobo)}</span>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              disabled={item.updating}
                              onClick={() => decrementQuantity(item.id)}
                              className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-lg text-gray-800 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              disabled={item.updating}
                              onClick={() => incrementQuantity(item.id)}
                              className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="py-6 px-6 text-center">
                          <span className="text-xl  font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text">
                            {formatCurrency(item.priceInKobo * item.quantity)}
                          </span>
                        </td>
                        <td className="py-6 px-6 text-center">
                          <button
                            onClick={() => handleRemove(item.id, item.productName)}
                            className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center group"
                          >
                            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-6">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      {/* <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div> */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{item.productName}</h3>
                        <p className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent font-bold text-sm">{formatCurrency(item.priceInKobo)}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.productName)}
                        className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4 ml-6">
                      <div className="flex items-center space-x-3">
                        <button
                          disabled={item.updating}
                          onClick={() => decrementQuantity(item.id)}
                          className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-gray-800">{item.quantity}</span>
                        <button
                          disabled={item.updating}
                          onClick={() => incrementQuantity(item.id)}
                          className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-lg font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text">
                        {formatCurrency(item.priceInKobo * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg h-fit sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-3 rounded-xl shadow-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                  <p className="text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-800">{formatCurrency(total)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    {/* <span className="text-lg font-bold text-gray-800">Subtotal</span> */}
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/cart/checkout"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-2 px-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 group mb-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

