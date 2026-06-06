"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { BugReportModal } from "./BugReportModal";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const FloatingButton = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Don't render the button on /account
  if (pathname === "/account") return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 0, 150, 0.6)" }}
        className="fixed bottom-6 md:bottom-6 right-6 w-12 h-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg backdrop-blur-sm hover:cursor-pointer z-50"
        onClick={() => setOpen(true)}
      >
        <Bug className="w-5 h-5 md:w-6 md:h-6" />
      </motion.button>

      <BugReportModal open={open} onOpenChange={setOpen} />
    </>
  );
};

export default FloatingButton;
