
"use client";


import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { axiosInstance } from "lib/axios";
import { useCartStore } from "store/cart/useCartStore";
import toast from "react-hot-toast";

export default function PaymentVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState("pending");
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);

  const hasPolled = useRef(false);


  useEffect(() => {
    if (!reference || hasPolled.current) return;

    hasPolled.current = true; // prevent re-running

    const pollStatus = async () => {
      try {
        const res = await axiosInstance.get(`/pay/paystack/verify/${reference}`);
        const orderStatus = res.data.status;

        setStatus(orderStatus);

        if (orderStatus === "paid") {
          clearCart();
          toast.success("Payment Successful!");

          setTimeout(() => {
            router.push("/cart/checkout/payment-verification/success");
          }, 1000);
        } else if (orderStatus === "failed") {
          setTimeout(() => {
            router.push("/cart/checkout/payment-verification/failure");
          }, 1000);
        } else {
          setTimeout(pollStatus, 3000);
        }
      } catch (err) {
        console.error("Polling failed:", err);
        setError("Unable to verify payment at the moment.");
      }
    };

    pollStatus();
  }, [reference, router, clearCart]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-700 animate-pulse">
              {status === "pending" ? "Verifying payment..." : "Redirecting..."}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}




