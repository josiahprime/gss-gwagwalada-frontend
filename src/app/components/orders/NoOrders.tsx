// src/app/components/orders/NoOrders.tsx
"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NoOrders() {
  const router = useRouter();

  // Inline animated Search icon
  const SearchIconAnimated = () => (
    <motion.div
      animate={{
        rotate: [-10, 10, -10], // tilt left-right-left
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="inline-block"
    >
      <Search className="w-10 h-10 text-emerald-600" />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-green-200 shadow-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-emerald-200"
      >
        <SearchIconAnimated />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 text-lg font-semibold text-gray-800"
      >
        No orders found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-sm text-gray-600 mt-1 max-w-xs text-center"
      >
        Looks like you haven’t placed any orders yet. When you do, they’ll show up right here.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        onClick={() => router.push("/")}
        className="mt-5 px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-sm"
      >
        Start Shopping
      </motion.button>
    </motion.div>
  );
}
