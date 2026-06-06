"use client";

import { useRef } from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import type { Product } from "../../../store/product/productTypes";

interface Props {
  products: Product[];
}

const MobileProductSlider = ({ products }: Props) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full py-4 md:hidden">
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar px-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0"
            style={{ width: 'calc(50% - 8px)' }} // exactly 2 cards visible including gap
          >
            <ProductCard
              productName={product.productName}
              description={
                product.description.length > 80
                  ? `${product.description.slice(0, 80)}...`
                  : product.description
              }
              id={product.id}
              image={product.images[0]?.url || "/placeholder.jpg"}
              rating={product.rating}
              priceInKobo={product.priceInKobo}
              unitType={product.unitType}
              isFavorite={product.isFavorite ?? false}
              stock={product.stock}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProductSlider;
