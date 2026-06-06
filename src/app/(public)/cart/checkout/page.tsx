'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useRef } from "react";
import { useCartStore } from "store/cart/useCartStore";
import { useCheckoutStore } from "store/checkout/useCheckoutStore";
import { ShoppingBag, CreditCard, Package, CheckCircle, Lock, Star, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import OrderSummary from "app/components/Checkout/OrderSummary";
import ShippingForm from "app/components/Checkout/ShippingForm";
import PaymentSection from "app/components/Checkout/PaymentSection";
import { useOrderStore } from "store/order/useOrderStore";
import { CheckoutRequestPayload } from "store/checkout/checkoutTypes";
import { useFormStore } from "store/checkout/useFormStore";






export type FormField = "firstName" | "lastName" | "city" | "state"  | "email" | "phone" | "address" | "extraInstructions" | "landmark" | "postalCode" | "pickupStation";

const CheckoutPage = () => {
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState<"home" | "pickup">("home");
  const [calculationDone, setCalculationDone] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const previewOrder = useOrderStore((state)=>(state.previewOrder))
  const items = useCartStore((state)=>(state.items))
  const { handlePaystackPayment} = useCheckoutStore();
  const setAmount = useCheckoutStore((state)=>(state.setAmount))
  const amount = useCheckoutStore((state)=>(state.amount))
  const preview = useOrderStore((state)=>(state.preview)) 
  const isPaying = useCheckoutStore((state)=>(state.isPaying))
  const currentStep = useCheckoutStore((state) => state.currentStep);
  const setCurrentStep = useCheckoutStore((state) => state.setCurrentStep);
  const hasRedirected = useRef(false);

   useEffect(() => {
    if (!hasRedirected.current && (!cartItems || cartItems.length === 0)) {
      hasRedirected.current = true; // ✅ prevent duplicate toasts

      toast(
        "✨ Poof! Your cart is empty… Sending you to products! ",
        {
          duration: 5000,
          style: {
            background: "white",
            color: "#111",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "12px",
            padding: "12px 20px",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "15px",
          },
          icon: "",
        }
      );

      setTimeout(() => {
        router.push("/products");
      }, 400); // small delay so toast appears before redirect
    }
  }, [cartItems, router]);




  const [showSummary, setShowSummary] = useState(false);

  console.log('items', items)

  const { formData, setFormData } = useFormStore();


  useEffect(() => {
    if (calculationDone && preview?.total) {
      setAmount(preview.total);
    }
  }, [calculationDone, preview, setAmount]);

  useEffect(() => {
    const stored = localStorage.getItem("checkout-store");
    // checkout-store
    

    if (!stored) {
      // First time arriving to checkout
      setCurrentStep(1);
    }
  }, [setCurrentStep]);


  const hasCalculated = useRef(false);

  useEffect(() => {
    if (!hasCalculated.current && cartItems.length && formData.city && formData.state && currentStep >= 2) {
      hasCalculated.current = true;

      console.log("🎯 Running previewOrder");
      previewOrder(cartItems, { state: formData.state, city: formData.city }, deliveryType)
        .then(() => setCalculationDone(true))
        .catch(() => {
          toast.error("Failed to restore order preview. Please recalculate.");
          setCurrentStep(1);
        });
    }
  }, [cartItems, formData, currentStep, deliveryType, previewOrder, setCurrentStep]);


  







  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ [e.target.name]: e.target.value });
  };





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handle submit was triggered')
    const { firstName, lastName, email, phone, address, postalCode, state, city, pickupStation, landmark, extraInstructions } = formData;

    const name = `${firstName} ${lastName}`;

    if (deliveryType === 'home') {
      if (!email || !name || !phone || !address || !postalCode || !state || !city) {
        toast.error("Please fill out all required home delivery fields");
        return;
      }
    } else {
      if (!email || !name || !phone) {
        toast.error("Please fill out all required pickup fields");
        return;
      }
    }

    

    if (!preview?.total) {
      toast.error("Total not calculated yet. Please wait...");
      return;
    }

    const formattedItems: CheckoutRequestPayload["items"] = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      discountId: item.discountId ?? undefined, 
    }));



    console.log('subtotal',preview.subtotal)

    handlePaystackPayment({
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
      items: formattedItems
    });

  };



  const steps = [
    { number: 1, title: "Shipping", icon: Package },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Complete", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-2 rounded-xl">
                <ShoppingBag className="md:w-6 md:h-6 w-4 h-4 text-white" />
              </div>
              <h1 className="md:text-2xl text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                RichField Checkout
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="max-w-7xl sm:max-w-3xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-center mb-8 sm:mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center 
                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                    rounded-full border-2 transition-all duration-300 
                    ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-green-600 to-emerald-700 border-transparent text-white shadow-md sm:shadow-lg'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}
                >
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="ml-2 sm:ml-3 mr-4 sm:mr-8">
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    Step {step.number}
                  </p>
                  <p
                    className={`text-xs sm:text-sm ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 transition-all duration-300 
                      w-8 sm:w-12 md:w-16 
                      ${
                        currentStep > step.number
                          ? 'bg-gradient-to-r from-green-600 to-emerald-700'
                          : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Summary sidebar for desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <OrderSummary items={cartItems} amount={amount} calculationDone={calculationDone} />
          </div>
          {/* <div className="order-1 lg:order-2 lg:col-span-1">
            <OrderSummary items={cartItems} amount={amount} calculationDone={calculationDone} />
          </div> */}



          {/* Shipping & Payment Sections */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-8">
            {currentStep === 1 && (
              <ShippingForm 
                formData={formData}
                handleChange={handleChange}
                deliveryType={deliveryType}
                onNext={() => setCurrentStep(2)}
                setDeliveryType={setDeliveryType}
                cartItems={cartItems}
                previewOrder={previewOrder} 
                setCalculationDone={setCalculationDone}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentSection 
                amount={amount}
                isPaying={isPaying}
                handleSubmit={handleSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Complete!</h2>
                  <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
                  
                  <div className="flex items-center justify-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <button className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      


      {/* Floating Full-Width Pill Footer */}
      <div className="fixed bottom-4 left-0 right-0 z-50 lg:hidden flex justify-center">
        {/* Full-width pill background */}
        <div className="relative w-[97%] bg-white rounded-3xl shadow-md px-6 py-7 flex text-center justify-center items-center">
          
          {/* Floating ShoppingBag Icon */}
          <div className="flex flex-col items-center justify-center">
              <button
              onClick={() => setShowSummary(true)}
              className="absolute -top-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>

            {/* Text inside the pill */}
            {/* Text inside the pill with subtle pop animation */}
            <motion.span
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-green-600 font-semibold text-sm absolute bottom-2"
            >
              View Order
            </motion.span>
          </div>
        </div>
      </div>



      {/* ==============================
        Slide-up Bottom Sheet (Framer Motion)
        ============================== */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-end justify-center lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/40" 
              onClick={() => setShowSummary(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              className="bg-white w-full max-h-[70vh] rounded-t-3xl p-6 shadow-2xl overflow-y-auto no-scrollbar relative z-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

              {/* Header with close icon */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
                <button 
                  onClick={() => setShowSummary(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Actual summary */}
              <OrderSummary 
                items={cartItems} 
                amount={amount} 
                calculationDone={calculationDone} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
};

export default CheckoutPage;


