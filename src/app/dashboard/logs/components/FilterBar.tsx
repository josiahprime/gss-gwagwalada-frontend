import { useState } from "react";
import { LogLevel } from "lib/log-utils";
import { Calendar } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: {
    level?: LogLevel;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [level, setLevel] = useState<LogLevel | "all">("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = () => {
    onFilterChange({
      level: level !== "all" ? (level as LogLevel) : undefined,
      search: search || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTimeout(() => {
      onFilterChange({
        level: level !== "all" ? (level as LogLevel) : undefined,
        search: value || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });
    }, 300);
  };

  const handleLevelChange = (value: string) => {
    setLevel(value as LogLevel | "all");
    onFilterChange({
      level: value !== "all" ? (value as LogLevel) : undefined,
      search: search || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  };

  const handleReset = () => {
    setLevel("all");
    setSearch("");
    setStartDate("");
    setEndDate("");
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search by user ID, order ID, or message..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Log Level Dropdown */}
      <div className="flex-1">
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
          Log Level
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => handleLevelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Date Range Picker */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleFilterChange();
            }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleFilterChange();
            }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
