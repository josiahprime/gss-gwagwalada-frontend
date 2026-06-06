import type { Promotion } from "store/promotion/promotionTypes"; // ✅ store version
import type { Product } from "store/product/productTypes";
import { MoreHorizontal, Search, Edit2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useThemeStore } from "store/theme/themeStore";

interface PromotionsTableProps {
  promotions: Promotion[];
  products: Product[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (promotionId: string) => void;
}


const statusColors = {
  Draft: "bg-slate-100 text-slate-700 border border-slate-200",
  Scheduled: "bg-amber-100 text-amber-800 border border-amber-200",
  Active: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Expired: "bg-rose-100 text-rose-800 border border-rose-200",
} as const;


const themeLabels = {
  christmas: "Christmas",
  "black-friday": "Black Friday",
  valentines: "Valentines",
  custom: "Custom",
} as const;

const themeStyles = {
  christmas: "bg-red-50 text-red-700 border border-red-200",
  "black-friday": "bg-neutral-950 text-neutral-100 border border-neutral-800",
  valentines: "bg-rose-50 text-rose-700 border border-rose-200",
  custom: "bg-indigo-50 text-indigo-700 border border-indigo-200",
} as const;






export default function PromotionsTable({
  promotions,
  onEdit,
  onDelete,
}: PromotionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const theme = useThemeStore((s) => s.theme);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) =>
      promo.headline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [promotions, searchQuery]);

  const getProductCount = (promotionId: string) => {
    const promotion = promotions.find((p) => p.id === promotionId);
    return promotion?.selectedProductIds?.length || 0;
  };

  const getPromotionStatus = (promotion: Promotion): "Draft" | "Scheduled" | "Active" | "Expired" => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (promotion.isActive && now >= start && now <= end) return "Active";
    if (now < start) return "Scheduled";
    if (now > end) return "Expired";
    return "Draft";
  };


  


  return (
    <div className="space-y-4">
      <div className={`rounded-xl shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        theme === "light" ? "bg-white border-gray-300" : "bg-gray-900 border-gray-200"
      }`}>
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search promotions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className={`p-6 rounded-xl shadow-xl transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
      }`}>
        <table className="w-full">
          <thead className={theme === "dark"
            ? "bg-gray-900 text-gray-300"
            : "bg-gray-100 text-gray-700"
          }>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Promotion Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Theme
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                Products
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-sm text-gray-500"
                >
                  No promotions found
                </td>
              </tr>
            ) : (
              filteredPromotions.map((promotion) => {
                const status = getPromotionStatus(promotion);
                const themeKey = promotion.theme.toLowerCase().replace("_", "-") as
                  | "christmas"
                  | "black-friday"
                  | "valentines"
                  | "custom";

                return (
                  <tr
                    key={promotion.id}
                    className={`border-b transition-colors duration-500 ${
                      theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {promotion.headline}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          themeStyles[themeKey]
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                        {themeLabels[themeKey]}
                      </span>


                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(promotion.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(promotion.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[status as keyof typeof statusColors]
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-800">
                        {getProductCount(promotion.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === promotion.id ? null : promotion.id
                            )
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {openMenuId === promotion.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                            <button
                              onClick={() => {
                                onEdit(promotion);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                onDelete(promotion.id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {filteredPromotions.length} of {promotions.length} promotions
        </p>
        <div className="flex gap-2">
          <button
            disabled
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            disabled
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
