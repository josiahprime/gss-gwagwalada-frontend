"use client";

import { motion } from "framer-motion";
import { Info, X } from "lucide-react";
import React, { useState } from "react";

interface DemoNoticeProps {
  message?: string;
}

const DemoNotice: React.FC<DemoNoticeProps> = ({
  message = "This page is currently running in demo mode with random sample data and images.",
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-white/30 backdrop-blur-md text-gray-900 border border-white/40 shadow-lg rounded-xl px-4 sm:px-5 py-3 text-sm sm:text-base font-medium max-w-xs sm:max-w-sm flex items-start gap-3 animate-pulse-bg"
    >
      <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-700" />
      <p className="leading-snug text-gray-800 animate-shimmer-demo">{message}</p>
      <button onClick={() => setVisible(false)} className="ml-auto text-gray-700 hover:text-gray-600 transition">
        <X className="w-4 h-4" />
      </button>
    </motion.div>

  );
};

export default DemoNotice;
