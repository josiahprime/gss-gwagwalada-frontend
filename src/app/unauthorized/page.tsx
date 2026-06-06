"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ShieldAlert } from "lucide-react";
import { useAuthStore } from "store/auth/useAuthStore";

export default function UnauthorizedPage() {

    const authUser = useAuthStore((state)=>state.authUser)
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-red-600 to-rose-700 flex items-center justify-center text-white px-4 overflow-hidden">
      {/* Floating icons */}
      <FloatingIcon icon={<Lock size={34} />} className="top-20 left-10" delay={0} />
      <FloatingIcon icon={<ShieldAlert size={36} />} className="bottom-24 right-16" delay={0.3} />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <motion.h1
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-[4rem] sm:text-[6rem] font-extrabold drop-shadow-lg"
        >
          401
        </motion.h1>

        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          <ShieldAlert className="text-yellow-300" />
          <span>Unauthorized</span>
        </div>

        <p className="mt-2 text-sm sm:text-base text-red-100 max-w-md mx-auto">
          You don’t have permission to access this page.  
          The door is locked. On purpose.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 flex justify-center gap-4"
        >
          {authUser ? (
            <Link href="/" className="rounded-full bg-white text-red-700 px-6 py-3 font-semibold shadow-lg hover:bg-red-50 transition">
                Go Home
            </Link>
            ) : (
            <Link href="/login" className="rounded-full border border-white px-6 py-3 font-semibold hover:bg-white/10 transition">
                Login
            </Link>
            )}

        </motion.div>
      </motion.div>
    </div>
  );
}

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
      animate={{ y: [0, -14, 0] }}
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
