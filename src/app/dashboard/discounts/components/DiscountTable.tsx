import { useState, useMemo } from "react";
import DiscountEmptyState from "app/dashboard/ui/DiscountEmptyState";
import type { Discount } from "store/discount/discountTypes";
import DiscountRow from "./DiscountRow";

interface Props {
  discounts: Discount[];
  onEdit: (d: Discount) => void;
  onDelete: (id: string) => void;
  theme: string;
}

export default function DiscountTable({
  discounts,
  onEdit,
  onDelete,
  theme,
}: Props) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // filtered discounts based on selected types
  const filteredDiscounts = useMemo(() => {
    if (selectedTypes.length === 0) return discounts;
    return discounts.filter((d) => selectedTypes.includes(d.type));
  }, [discounts, selectedTypes]);

  const isTrulyEmpty = discounts.length === 0;
  const isFilteredEmpty = discounts.length > 0 && filteredDiscounts.length === 0;

  // TRUE EMPTY: show only empty state
  if (isTrulyEmpty) {
    return (
      <div
        className={`p-6 m-4 rounded-xl shadow-xl transition-colors duration-500 ${
          theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
        }`}
      >
        <DiscountEmptyState
          theme={theme}
          isFiltered={false}
          onCreate={() => {
            // open create-discount modal
          }}
        />
      </div>
    );
  }

  // NORMAL + FILTERED STATES
  return (
    <div
      className={`p-6 m-4 rounded-xl shadow-xl transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
      }`}
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["percentage", "fixed"].map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-sm ${
              selectedTypes.includes(type)
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <section className="bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left font-medium">Name</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Value</th>
              <th className="p-4 font-medium">Active</th>
              <th className="p-4 font-medium">Validity</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isFilteredEmpty ? (
              <tr>
                <td colSpan={6}>
                  <DiscountEmptyState theme={theme} isFiltered />
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((d) => (
                <DiscountRow
                  key={d.id}
                  discount={d}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
