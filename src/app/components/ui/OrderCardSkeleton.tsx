import { motion } from "framer-motion";


export function OrderCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-200 shadow-md rounded-lg bg-white overflow-hidden animate-pulse"
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-gray-200">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mt-1.5" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-2">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="flex-1" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
      </div>
    </motion.div>
  );
}
