"use client";
import React from "react";
import { Edit3, Trash2, Package } from "lucide-react"; // Modern icon set
import { formatCurrency } from "utils/FormatCurrency";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  description: string;
  stock: number;
  theme: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  title,
  price,
  description,
  stock,
  theme,
  onEdit,
  onDelete,
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 border shadow-sm hover:shadow-2xl ${
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-200"
          : "bg-white border-gray-100 text-gray-800"
      }`}
    >
      {/* 1. Image Section with Overlay Actions */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={false} // Use true only for the first 2-3 images on the page
        />
        
        {/* Modern Floating Action Buttons (Glassmorphism) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onEdit(id)}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg hover:bg-green-500 transition-colors"
            title="Edit Product"
          >
            <Edit3 size={18} className="text-white" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg hover:bg-red-500 transition-colors"
            title="Delete Product"
          >
            <Trash2 size={18} className="text-white" />
          </button>
        </div>


        {/* Stock Badge (Matching Table Styles) */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
            stock > 0 
              ? (isDark ? "bg-green-900/80 text-green-400" : "bg-green-100/90 text-green-700")
              : (isDark ? "bg-red-900/80 text-red-400" : "bg-red-100/90 text-red-700")
          }`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h2 className={`text-lg font-bold leading-tight truncate transition-colors duration-500 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {title}
          </h2>
        </div>

        <p className={`text-sm mb-4 line-clamp-2 flex-grow transition-colors duration-500 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}>
          {description}
        </p>

        {/* 3. Footer Section (Price & Quick Stats) */}
        <div className={`mt-auto pt-4 border-t flex items-center justify-between ${
          isDark ? "border-gray-700" : "border-gray-50"
        }`}>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-bold tracking-widest ${
               isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              Price
            </span>
            <span className="text-lg font-black text-green-600 dark:text-green-400">
              {formatCurrency(price)}
            </span>
          </div>
          
          {/* <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
             <Package size={20} className={isDark ? "text-gray-400" : "text-gray-400"} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;