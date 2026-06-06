import { motion } from "framer-motion";
import { Tag, Percent, PlusCircle } from "lucide-react";

interface Props {
  theme: string;
  isFiltered: boolean;
  onCreate?: () => void;
}

export default function DiscountEmptyState({
  theme,
  isFiltered,
  onCreate,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
          theme === "dark"
            ? "bg-gray-600 text-gray-200"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        <motion.div
            animate={{
                y: [0, -4, 0],
                rotate: [0, -6, 6, 0],
            }}
            transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 3.5,
            }}
            >
            {isFiltered ? (
                <Percent className="h-6 w-6" />
            ) : (
                <Tag className="h-6 w-6" />
            )}
        </motion.div>

      </div>

      <h3 className="text-sm font-semibold">
        {isFiltered ? "No discounts match this filter" : "No discounts yet"}
      </h3>

      <p className="mt-1 max-w-xs text-xs text-gray-500">
        {isFiltered
          ? "Try switching filters or clearing them to see all discounts."
          : "Create your first discount to start rewarding customers."}
      </p>

      {onCreate && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
          onClick={onCreate}
        >
          <PlusCircle className="h-4 w-4" />
          Create Discount
        </motion.button>
      )}
    </motion.div>
  );
}
