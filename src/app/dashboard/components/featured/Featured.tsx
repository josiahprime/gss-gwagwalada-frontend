"use client";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useEffect } from "react";
import { useDashboardStore } from "store/dashboard/useDashboardStore";
import { useThemeStore } from "store/theme/themeStore";

const Featured = () => {
  const featured = useDashboardStore((state) => state.featured);
  const loadingFeatured = useDashboardStore((state) => state.loadingFeatured);
  const fetchFeatured = useDashboardStore((state) => state.fetchFeatured);

  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    fetchFeatured();
  }, []);

  if (loadingFeatured || !featured) {
    return (
      <div className={`flex-[2] shadow-md p-4 rounded-lg flex items-center justify-center
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"} transition-colors duration-500`}>
        <p>Loading...</p>
      </div>
    );
  }

  const { todayRevenue, lastWeek, lastMonth, target, percentage } = featured.data;

  const cardBg = theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800";
  const labelColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const noteColor = theme === "dark" ? "text-gray-400" : "text-gray-400";
  const arrowDownColor = theme === "dark" ? "text-red-400" : "text-red-500";
  const arrowUpColor = theme === "dark" ? "text-green-400" : "text-green-500";

  return (
    <div className={`flex-[2] shadow-md p-4 rounded-lg ${cardBg} transition-colors duration-500`}>
      <div className={`flex items-center justify-between ${labelColor}`}>
        <h1 className="text-base font-medium">Total Revenue</h1>
        <BsThreeDotsVertical size={16} />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-4">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={5}
            styles={{
              path: { stroke: theme === "dark" ? "#22c55e" : "#10b981" },
              text: { fill: theme === "dark" ? "#f3f4f6" : "#111827", fontSize: '16px' },
              trail: { stroke: theme === "dark" ? "#4b5563" : "#e5e7eb" },
            }}
          />
        </div>

        <p className={`font-medium ${noteColor}`}>Total sales made today</p>
        <p className="text-2xl font-semibold">₦{todayRevenue}</p>
        <p className={`text-xs text-center font-light ${noteColor}`}>
          Previous transactions processing. Last payments may not be included.
        </p>

        <div className="w-full flex justify-between mt-4">
          <div className="text-center">
            <div className={`text-sm ${labelColor}`}>Target</div>
            <div className={`flex items-center justify-center mt-2 text-sm ${arrowDownColor}`}>
              <FaArrowDown size={16} />
              <span className="ml-1">₦{target}</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${labelColor}`}>Last Week</div>
            <div className={`flex items-center justify-center mt-2 text-sm ${arrowUpColor}`}>
              <FaArrowUp size={16} />
              <span className="ml-1">₦{lastWeek}</span>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-sm ${labelColor}`}>Last Month</div>
            <div className={`flex items-center justify-center mt-2 text-sm ${arrowUpColor}`}>
              <FaArrowUp size={16} />
              <span className="ml-1">₦{lastMonth}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
