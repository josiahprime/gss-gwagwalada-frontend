import { getCountdownText } from "app/types/promotion";
import type { Promotion } from "store/promotion/promotionTypes";
import type { Product } from "store/product/productTypes";
import Image from "next/image";
// import { useThemeStore } from "store/theme/themeStore";


interface PromotionPreviewProps {
  promotion: Promotion;
  selectedProducts: Product[];
}



const themeKeyMap: Record<Promotion["theme"], keyof typeof themeStyles> = {
  CHRISTMAS: "christmas",
  BLACK_FRIDAY: "black-friday",
  VALENTINES: "valentines",
  CUSTOM: "custom",
};


const themeStyles = {
  christmas:
    "bg-gradient-to-b from-red-50 to-green-50 border-red-200 [&_*]:text-red-900",
  "black-friday":
    "bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 [&_*]:text-white",
  valentines:
    "bg-gradient-to-b from-pink-50 to-red-50 border-pink-200 [&_*]:text-pink-900",
  custom:
    "bg-gradient-to-b from-indigo-50 to-blue-50 border-indigo-200 [&_*]:text-indigo-900",
};



const themeBadgeStyles = {
  christmas: "bg-red-100 text-red-800",
  "black-friday": "bg-yellow-100 text-yellow-900",
  valentines: "bg-pink-100 text-pink-800",
  custom: "bg-blue-100 text-blue-800",
};

const isDark = (theme: string) => theme === "black-friday";

export default function PromotionPreview({
  promotion,
  selectedProducts,
}: PromotionPreviewProps) {
  const countdownText = getCountdownText(promotion.endDate);
  const dark = isDark(promotion.theme);

  // const theme = useThemeStore((s) => s.theme);

  const themeKey = themeKeyMap[promotion.theme];
  const style = themeStyles[themeKey];
  const badgeStyle = themeBadgeStyles[themeKey];


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Storefront Preview</h3>
        <span className="inline-block px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700">
          Live Preview
        </span>
      </div>

      <div className={`rounded-lg border-2 p-8 ${style} transition-all`}>
        {/* Badge and Badge Text */}
        <div className="mb-4 inline-block">
          <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${badgeStyle}`}>
            {promotion.badgeText || "Special Offer"}
          </span>
        </div>

        {/* Headline */}
        <h2
          className={`mb-3 text-2xl font-bold ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {promotion.headline || "Untitled Promotion"}
        </h2>

        {/* Description */}
        <p className={`mb-4 text-base ${dark ? "text-gray-200" : "text-gray-700"}`}>
          {promotion.description || "Add a description for your promotion"}
        </p>

        {/* Countdown */}
        <div
          className={`mb-6 inline-block rounded-full px-4 py-2 ${
            dark ? "bg-yellow-500/20 text-yellow-200" : "bg-amber-100 text-amber-800"
          } font-semibold`}
        >
          ⏱️ {countdownText}
        </div>

        {/* Products Grid */}
        {selectedProducts.length > 0 && (
          <div className="mt-8">
            <p className={`mb-4 text-sm font-semibold opacity-75`}>
              Featured Products
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`rounded-lg border ${
                    dark
                      ? "border-gray-600 bg-gray-800/50"
                      : "border-gray-200 bg-white/50"
                  } overflow-hidden transition-transform hover:scale-105`}
                >
                  {product.images[0].url && (
                    <div className="aspect-square overflow-hidden bg-gray-200 relative">
                      <Image
                        src={product.images[0].url || 'productImage.png'}
                        alt={product.productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>

                  )}
                  <div className="p-3">
                    <p
                      className={`mb-2 text-sm font-medium ${
                        dark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {product.productName}
                    </p>
                    <p className={`text-xs font-semibold ${dark ? "text-yellow-200" : "text-amber-700"}`}>
                      ${product.priceInKobo.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProducts.length === 0 && (
          <div
            className={`rounded-lg border-2 border-dashed p-6 text-center ${
              dark
                ? "border-gray-600 text-gray-400"
                : "border-gray-300 text-gray-500"
            }`}
          >
            <p className="text-sm">No products selected yet</p>
            <p className="text-xs opacity-75">Add products to preview them here</p>
          </div>
        )}
      </div>
    </div>
  );
}
