"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { AiFillStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useCartStore } from "store/cart/useCartStore";
import { useAuthStore } from "store/auth/useAuthStore";
import { useProductStore } from "store/product/useProductStore";
import { formatCurrency } from "utils/FormatCurrency";
import { format, isToday, isTomorrow } from "date-fns";
import type { Product } from "store/product/productTypes";
// import type { DailyDeal } from "store/product/productTypes";

// stable rating generator
const getStableRating = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = Math.abs(hash % 100) / 100;
  return Math.min(5, Math.max(3, Math.round(random * 4 + 1) / 2 + 2.5));
};

interface DealCardProps {
  deal: Product;
}

export default function DealCard({ deal }: DealCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const authUser = useAuthStore((s) => s.authUser);
  // console.log('deal from flash dealcard', deal)

  const [favorite, setFavorite] = useState(deal.isFavorite || false);
  const [togglingFav, setTogglingFav] = useState(false);
  const [cartClicked, setCartClicked] = useState(false);

  const discountValue = deal.discount?.value ?? 0;

  const originalPrice = deal.priceInKobo;
  const discountedPrice = discountValue
    ? Math.round(originalPrice - (originalPrice * discountValue) / 100)
    : originalPrice;

  const mainImage = deal.images?.[0]?.url || "/placeholder.jpg";

  const stableRating = useMemo(() => getStableRating(deal.id), [deal.id]);

  // Expiry formatting
  let formattedExpiry: string | null = null;
  if (deal.discount?.endDate) {
    const expiryDate = new Date(deal.discount.endDate);
    if (isToday(expiryDate)) {
      formattedExpiry = `Today · ${format(expiryDate, "hh:mm a")}`;
    } else if (isTomorrow(expiryDate)) {
      formattedExpiry = `Tomorrow · ${format(expiryDate, "hh:mm a")}`;
    } else {
      formattedExpiry = format(expiryDate, "MMM d · hh:mm a");
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setCartClicked(true);

    addToCart({
      id: deal.id,
      productId: deal.id,
      productName: deal.productName,
      image: mainImage,
      priceInKobo: discountedPrice,
      quantity: 1,
      unitType: deal.unitType || "each",
    });

    toast.success(`${deal.productName} added to cart!`);
    setTimeout(() => setCartClicked(false), 300);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (togglingFav) return;

    if (!authUser?.id) {
      toast.error("You must be logged in to add to wishlist");
      return;
    }

    setTogglingFav(true);
    try {
      const res = await toggleFavorite(authUser.id, deal.id);
      setFavorite(res === "added");
      toast.success(
        `${deal.productName} ${res === "added" ? "added to" : "removed from"} wishlist`
      );
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setTogglingFav(false);
    }
  };

  return (
    <Link href={`/products/${deal.id}`} className="block w-full group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col relative transition-transform hover:scale-[1.02]">

        {/* IMAGE */}
        <div className="relative">
          <Image
            src={mainImage}
            alt={deal.productName}
            width={400}
            height={200}
            className="w-full h-40 sm:h-48 object-cover"
          />
          

          {/* Discount badge (bottom-right) */}
          {discountValue > 0 && (
            <span className="absolute bottom-2 right-2 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded">
              -{discountValue}%
            </span>
          )}

          {/* Favorite (top-left) */}
          {authUser && (
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleFavoriteToggle}
              disabled={togglingFav}
              className="absolute top-2 left-2 rounded-full p-1 shadow-md bg-white bg-opacity-90 hover:bg-opacity-100"
            >
              {favorite ? (
                <AiFillHeart size={20} className="text-red-600" />
              ) : (
                <AiOutlineHeart size={20} className="text-gray-600" />
              )}
            </motion.button>

          )}

          {/* Add to cart (top-right) */}
          <motion.button
            whileTap={{ scale: 1.3 }}
            animate={cartClicked ? { scale: 1.2 } : { scale: 1 }}
            onClick={handleAddToCart}
            className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1 shadow-md"
          >
            <FiShoppingCart size={20} className="text-teal-900" />
          </motion.button>
        </div>


        {/* DETAILS */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">

          <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
            {deal.productName}
          </h2>

          {/* <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-3">
            {deal.description}
          </p> */}

          {/* Rating */}
          <div className="flex items-center mb-1 gap-1 text-yellow-500 text-xs sm:text-sm">
            {Array.from({ length: 5 }, (_, i) => {
              const full = i + 1 <= Math.floor(stableRating);
              const half = stableRating - i > 0 && stableRating - i < 1;
              return (
                <AiFillStar
                  key={i}
                  className={
                    full
                      ? "fill-current"
                      : half
                      ? "text-yellow-400 opacity-60"
                      : "text-gray-300"
                  }
                />
              );
            })}
            <span className="text-gray-500 text-[10px] sm:text-xs ml-1">
              ({stableRating.toFixed(1)})
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-auto flex items-center gap-3">
            <span className="text-green-600 font-bold text-sm sm:text-base">
              {formatCurrency(discountedPrice)}
              <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                /{deal.unitType || "each"}
              </span>
            </span>

            {discountValue > 0 && (
              <span className="line-through text-[11px] sm:text-sm text-gray-400">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Expiry */}
          {formattedExpiry && (
            <span className="text-[11px] font-bold text-red-600 mt-1">
              Ends: {formattedExpiry}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
