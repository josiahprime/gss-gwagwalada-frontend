'use client';

import Link from "next/link";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const EmptyCart = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-start justify-center px-4 pt-24">
      <div className="text-center max-w-md mx-auto">
        {/* Animated Cart Circle */}
        <motion.div
          className="w-28 h-28 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1, scale: [1, 1.1, 1] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
          }}
        >
          {/* Shopping Cart Icon with continuous subtle rotation */}
          <motion.div
            animate={{ rotate: [ -5, 5, -5 ] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ShoppingCart className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>

        {/* Animated Heading */}
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120, delay: 0.5 }}
        >
          Your Cart is Empty
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Start shopping and add some amazing products to your cart!
        </motion.p>

        {/* Animated Button */}
        <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
        }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/products"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
            <motion.span>Browse Products</motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default EmptyCart;
