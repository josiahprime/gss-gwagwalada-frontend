import { useState } from "react";

type Severity = "low" | "medium" | "high" | "critical";

interface CustomSelectProps {
  value: Severity | "";
  onChange: (value: Severity) => void;
  options: { value: Severity; label: string }[];
  placeholder?: string;
}

export const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (val: Severity) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left border border-gray-300 rounded-md p-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition flex justify-between items-center"
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto no-scrollbar">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
