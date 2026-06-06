"use client";

import { Promotion } from "store/promotion/promotionTypes";
import { Edit2, X, Calendar } from "lucide-react";
import { useThemeStore } from "store/theme/themeStore";
import { getCountdownText } from "app/types/promotion";

interface ActivePromotionCardProps {
  promotion: Promotion;
  onEdit: () => void;
  onDeactivate: () => void;
}

const themeGradients: Record<Promotion["theme"], string> = {
  CHRISTMAS: "from-red-50 to-green-50 border-red-200",
  BLACK_FRIDAY: "from-gray-900 to-gray-800 border-gray-700",
  VALENTINES: "from-pink-50 to-red-50 border-pink-200",
  CUSTOM: "from-blue-50 to-indigo-50 border-blue-200",
};

const themeTextColors: Record<Promotion["theme"], string> = {
  CHRISTMAS: "text-gray-900",
  BLACK_FRIDAY: "text-white",
  VALENTINES: "text-gray-900",
  CUSTOM: "text-gray-900",
};

const themeBadgeColors: Record<Promotion["theme"], string> = {
  CHRISTMAS: "bg-red-100 text-red-800",
  BLACK_FRIDAY: "bg-yellow-100 text-yellow-900",
  VALENTINES: "bg-pink-100 text-pink-800",
  CUSTOM: "bg-blue-100 text-blue-800",
};

export default function ActivePromotionCard({
  promotion,
  onEdit,
  onDeactivate,
}: ActivePromotionCardProps) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";
  const countdownText = getCountdownText(promotion.endDate);

  return (
    <div
      className={`rounded-xl border-2 p-6 md:p-8 transition-all hover:shadow-xl
        ${isDark ? "bg-gray-800 border-gray-700" : `bg-gradient-to-br ${themeGradients[promotion.theme]}`}
      `}
    >
      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${
            isDark ? "bg-gray-700 text-gray-200" : themeBadgeColors[promotion.theme]
          }`}
        >
          {promotion.badgeText}
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${
            isDark ? "bg-yellow-400 text-black" : "bg-gray-900 text-white"
          }`}
        >
          ACTIVE
        </span>
      </div>

      {/* Title & description */}
      <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? "text-white" : themeTextColors[promotion.theme]}`}>
        {promotion.headline}
      </h2>
      <p className={`text-md md:text-lg mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {promotion.description}
      </p>

      {/* Dates and countdown */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className={`${isDark ? "text-gray-400" : "text-gray-500"} w-4 h-4`} />
          <div>
            <p className="opacity-75 text-xs">Valid Period</p>
            <p className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
              {new Date(promotion.startDate).toLocaleDateString()} –{" "}
              {new Date(promotion.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className={`${isDark ? "text-amber-400" : "text-amber-600"} w-4 h-4`} />
          <div>
            <p className="opacity-75 text-xs">Time Remaining</p>
            <p className={`font-semibold ${isDark ? "text-amber-300" : "text-amber-600"}`}>
              {countdownText}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-auto">
        <button
          onClick={onEdit}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            isDark ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDeactivate}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold transition-colors ${
            isDark ? "border-gray-500 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-900 hover:bg-gray-50"
          }`}
        >
          <X className="w-4 h-4" />
          Deactivate
        </button>
      </div>
    </div>
  );
}
