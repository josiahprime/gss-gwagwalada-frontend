"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Gift, AlertTriangle, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 flex items-center justify-center text-white px-4">
      {/* Floating background elements */}
      <FloatingIcon
        icon={<ShoppingCart size={32} />}
        className="top-16 left-8 sm:top-24 sm:left-24"
        delay={0}
      />
      <FloatingIcon
        icon={<Package size={34} />}
        className="top-20 right-8 sm:top-32 sm:right-28"
        delay={0.2}
      />
      <FloatingIcon
        icon={<Gift size={32} />}
        className="bottom-20 right-10 sm:bottom-32 sm:right-40"
        delay={0.4}
      />
      <FloatingIcon
        icon={<ShoppingBag size={30} />}
        className="bottom-16 left-10 sm:bottom-24 sm:left-32"
        delay={0.6}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-[6rem] sm:text-[8rem] md:text-[10rem] font-extrabold drop-shadow-lg"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-2 text-lg sm:text-xl font-semibold">
          <AlertTriangle className="text-yellow-300" />
          <span>Page Not Found</span>
        </div>

        <p className="mt-2 text-sm sm:text-base text-green-100">
          Looks like this page doesn’t exist or wandered off to buy snacks.
        </p>

        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 inline-block"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white text-green-700 px-6 py-3 font-semibold shadow-lg hover:bg-green-50 transition"
          >
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Floating icon helper */
function FloatingIcon({
  icon,
  className,
  delay = 0,
}: {
  icon: React.ReactNode;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`absolute opacity-80 ${className}`}
    >
      {icon}
    </motion.div>
  );
}
