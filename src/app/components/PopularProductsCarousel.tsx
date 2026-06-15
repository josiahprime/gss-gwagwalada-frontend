'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import type { Product } from "store/product/productTypes";
import { ProductCard } from "./ProductCard/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  products: Product[];
}

const ProductSlider = ({ products }: Props) => {
  
  const visibleCount = 5;
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);

  const total = products?.length ?? 0;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % total);
      setAnimating(false);
    }, 500);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + total) % total);
      setAnimating(false);
    }, 500);
  }, [total]);

  const getVisibleProducts = useCallback(() => {
    if (!products || total === 0) return [];
    return Array.from({ length: visibleCount }, (_, i) => {
      const current = (index + i) % total;
      return products[current] ?? null;
    });
  }, [products, index, total]);

  useEffect(() => {
    if (total === 0) return;

    const startAutoSlide = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isHoveredRef.current) nextSlide();
      }, 2000);
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total, nextSlide]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    intervalRef.current = setInterval(() => {
      if (!isHoveredRef.current) nextSlide();
    }, 2000);
  };



  if (!products || total === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div
      className="relative max-w-7xl mx-auto py-10 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sliding wrapper */}
<div
  className={`flex gap-4 transition-transform duration-500 ease-in-out ${
    animating ? "transform translate-x-0" : ""
  }`}
>
    {getVisibleProducts().map((product, idx) =>
      product ? (
        <div
          // 🔥 FIXED: Appending the array loop index guarantees uniqueness
          key={`${product.id}-${idx}`}
          className="flex-1 min-w-[220px] max-w-[280px] shrink-0"
        >
          <ProductCard
            id={product.id}
            productName={product.productName}
            description={product.description}
            priceInKobo={product.priceInKobo}
            image={product.images?.[0]?.url ?? ""}
            rating={product.rating}
            unitType={product.unitType}
            isFavorite={product.isFavorite || false}
            stock={product.stock}
          />
        </div>
      ) : null
    )}
  </div>

      {/* Previous Button */}
      <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/30 shadow-lg hover:bg-black/40 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/30 shadow-lg hover:bg-black/40 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
    </div>
  );
};

export default ProductSlider;
