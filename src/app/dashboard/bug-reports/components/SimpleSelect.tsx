import React from "react";

interface SimpleSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col w-full md:w-40">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SimpleSelect;
