import React, { useState, useRef, useEffect } from "react";
import { useProductStore } from "store/product/useProductStore";

interface PriceRange {
  min?: number;
  max?: number;
}

interface PriceProps {
  value: PriceRange;
  onApply: (range: PriceRange) => void;
}

const Price: React.FC<PriceProps> = ({ value = {} }) => {
  const { query, setFilters } = useProductStore();

  const [open, setOpen] = useState(false); // closed by default
  const [minPrice, setMinPrice] = useState(() =>
    query.minPrice?.toString() ?? ""
  );
  const [maxPrice, setMaxPrice] = useState(() =>
    query.maxPrice?.toString() ?? ""
  );

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);



  useEffect(() => {
    setMinPrice(query.minPrice?.toString() ?? "");
    setMaxPrice(query.maxPrice?.toString() ?? "");
  }, [query.minPrice, query.maxPrice]);


  const handleApply = () => {
    const min = minPrice !== "" ? Number(minPrice) : undefined;
    const max = maxPrice !== "" ? Number(maxPrice) : undefined;

    console.log("Applying price filter", { min, max });

    if (min != null && max != null && min > max) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }

    setFilters({
      minPrice: min,
      maxPrice: max,
    });
  };



  const displayLabel =
    minPrice || maxPrice
      ? `₦${minPrice || 0} - ₦${maxPrice || "∞"}`
      : "Select price range";

  // Only allow digits
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setter(val);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((s) => !s)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm shadow-sm flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
      >

        <span className={`${minPrice || maxPrice ? "text-gray-900" : "text-gray-400"}`}>
          {displayLabel}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 p-4 rounded-lg border border-gray-100 bg-white shadow-xl space-y-4 z-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Min (₦)</label>
              <input
                type="text"
                value={minPrice}
                onChange={handleInputChange(setMinPrice)}
                placeholder="0"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-inner"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Max (₦)</label>
              <input
                type="text"
                value={maxPrice}
                onChange={handleInputChange(setMaxPrice)}
                placeholder="50000"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-inner"
              />
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition shadow-lg"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default Price;
