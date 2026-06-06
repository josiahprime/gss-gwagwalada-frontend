"use client";

import React from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  theme?: "light" | "dark";
  containerClassName?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  theme = "light",
  containerClassName = "",
}: EmptyStateProps) => {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`
        flex flex-col items-center justify-center
        py-24 px-6 rounded-3xl border-2 border-dashed
        transition-colors
        ${
          isDark
            ? "bg-gray-900/40 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }
        ${containerClassName}
      `}
    >
      <motion.div
        animate={{ y: [-2, 2, -2, 2, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
        className={`
          p-4 rounded-full mb-6
          ${isDark ? "bg-gray-800" : "bg-white shadow-sm"}
        `}
      >
        {icon}
      </motion.div>

      <h3
        className={`text-2xl font-semibold mb-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>

      {description && (
        <p
          className={`text-center max-w-md mb-8 text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="
            px-6 py-3 rounded-xl font-medium text-white
            bg-green-600 hover:bg-green-700
            shadow-lg shadow-green-500/20
            transition-all
          "
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
