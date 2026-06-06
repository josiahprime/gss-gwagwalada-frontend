import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useCartStore } from 'store/cart/useCartStore';
import { useAuthStore } from 'store/auth/useAuthStore';
import { useProductStore } from 'store/product/useProductStore';
import { formatCurrency } from '../../../utils/FormatCurrency';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { AiFillStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { motion } from 'framer-motion';

export type Discount = {
  id: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  label: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
};


type Product = {
  productName: string;
  description: string;
  id: string;
  image: string;
  priceInKobo: number;
  rating?: number;
  unitType: string; // e.g. 'per lb', 'each', etc.
  isFavorite: boolean;
  discount?: Discount;
  stock: number;
};

// Utility: consistent pseudo-random rating based on product ID
const getStableRating = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = Math.abs(hash % 100) / 100;
  // Random between 3 and 5 (allows half-stars)
  return Math.min(5, Math.max(3, Math.round(random * 4 + 1) / 2 + 2.5)); // e.g. 3.0–5.0 range
};

export const ProductCard: React.FC<Product> = ({
  productName,
  description,
  id,
  image,
  priceInKobo,
  rating,
  unitType,
  isFavorite,
  discount,
  stock
}: Product) => {
  const [cartClicked, setCartClicked] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);
  const authUser = useAuthStore((state) => state.authUser);
  const userId = authUser?.id;

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);
  

  const hasDiscount = discount && discount.isActive;

  let discountedPrice = priceInKobo;
  if (hasDiscount) {
    if (discount.type === "PERCENTAGE") {
      discountedPrice = Math.round(
        priceInKobo - priceInKobo * (discount.value / 100)
      );
    } else if (discount.type === "FIXED") {
      discountedPrice = Math.max(0, priceInKobo - discount.value);
    }
  }


  // Stable rating (DB value if exists, else generated)
  const stableRating = useMemo(
    () => rating || getStableRating(id),
    [id, rating]
  );

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCartClicked(true);

    addToCart({
      id,                   // satisfy CartItem.id
      productId: id,         // used for backend
      productName,
      image,
      priceInKobo: hasDiscount ? discountedPrice : priceInKobo,
      quantity: 1,
      unitType,
    });

    toast.success(`${productName} added to cart!`);
    setTimeout(() => setCartClicked(false), 300);
  };


  const handleFavoriteToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    if (!userId) {
      toast.error('you must be logged in to add item to favorite')
      return
    }

    try {
      const result = await toggleFavorite(userId, id);
      if (result === 'added') {
        toast.success(`${productName} added to wishlist`);
        setLocalFavorite(true);
      } else {
        toast.success(`${productName} removed from wishlist`);
        setLocalFavorite(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <Link
      href={`/products/${id}`}
      className="block w-full group"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col relative transition-transform  hover:scale-[1.02]">
        <div className="relative">

          {image && (
            <Image
              src={image}
              alt={productName}
              width={400}
              height={200}
              className="w-full h-40 sm:h-48 object-cover"
            />
          )}

          {/* Discount badge or Out-of-stock badge */}
          {stock <= 0 ? (
            <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-md">
              OUT OF STOCK
            </div>
          ) : hasDiscount ? (
            <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded">
              -{discount.value}
              {discount.type === "PERCENTAGE" ? "%" : " NGN"}
            </span>
          ) : null}


          {authUser && (
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={handleFavoriteToggle}
              disabled={isTogglingFavorite}
              className={`absolute top-2 left-2 rounded-full p-1 shadow-md transition-all ${
                isTogglingFavorite
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-white bg-opacity-90 hover:bg-opacity-100'
              }`}
            >
              {localFavorite ? (
                <AiFillHeart size={20} className="text-red-600" />
              ) : (
                <AiOutlineHeart size={20} className="text-gray-600" />
              )}
            </motion.button>
          )}

          <motion.button
          whileTap={{ scale: stock > 0 ? 1.3 : 1 }}
          onClick={handleAddToCart}
          animate={cartClicked ? { scale: 1.2 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          disabled={stock <= 0}
          className="absolute top-2 right-2 rounded-full p-1 shadow-md bg-white bg-opacity-90 hover:bg-opacity-100"
        >
          <div className="relative">
            <FiShoppingCart
              size={20}
              className={`${stock <= 0 ? 'text-red-600 opacity-70' : 'text-teal-900'}`}
            />
          </div>
        </motion.button>

        </div>

        <div className="p-2 sm:p-4 flex-1 flex flex-col">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
            {productName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-3">
            {description}
          </p>

          <div className="mt-auto">
            <div className="flex items-center mb-2 gap-1 text-yellow-500 text-xs sm:text-sm">
              {Array.from({ length: 5 }, (_, i) => {
                const fullStar = i + 1 <= Math.floor(stableRating);
                const halfStar = stableRating - i > 0 && stableRating - i < 1;
                return (
                  <AiFillStar
                    key={i}
                    className={
                      fullStar
                        ? 'fill-current'
                        : halfStar
                        ? 'text-yellow-400 opacity-60'
                        : 'text-gray-300'
                    }
                  />
                );
              })}
              <span className="text-gray-500 text-[10px] sm:text-xs ml-1">
                ({stableRating.toFixed(1)})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-600 font-bold text-[12px] md:text-sm sm:text-base">
                {formatCurrency(hasDiscount ? discountedPrice : priceInKobo)}
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                  /{unitType}
                </span>
              </span>

              {hasDiscount && (
                <span className="line-through text-[11px] sm:text-sm text-gray-400">
                  {formatCurrency(priceInKobo)}
                </span>
              )}

              {/* {hasDiscount && (
                <span className="text-red-500 text-[10px] sm:text-xs font-semibold">
                  -{discount.value}%
                </span>
              )} */}
            </div>

          </div>
        </div>
      </div>
    </Link>

  );
}

