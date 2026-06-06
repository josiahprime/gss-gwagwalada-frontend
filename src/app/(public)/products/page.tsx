"use client";
import React, { useEffect } from "react";
import ShopSideNav from "../../../../sections/products/ShopSideNav/ShopSideNav";
import PaginatedProducts from "../../../../sections/products/Pagination/Pagination";
import { useProductStore } from "store/product/useProductStore";
import { useAuthStore } from "store/auth/useAuthStore";
import { ProductState } from "store/product/productTypes";
import { useSearchParams } from "next/navigation";
import MobileCategoryNav from "../../../../sections/products/ShopSideNav/ScrollBar";
import ProductCardSkeleton from "app/components/ui/ProductCardSkeleton";

const Product = () => {
  const isLoading = useProductStore((state: ProductState) => state.isLoading);
  // const isLoading = true
  const setProductsWithFavorites = useProductStore(state => state.setFavoritesFor);

  const favoriteIds = useProductStore((state) => state.favoriteIds);
  const fetchFavoriteIds = useProductStore((state)=>state.fetchFavoriteIds)
  const error = useProductStore((state: ProductState) => state.error);
  const userId = useAuthStore((state) => state.authUser?.id);

  

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  useEffect(() => {
    useProductStore.getState().setCategory(category);
  }, [category]);


  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const ids = await fetchFavoriteIds(userId);
        setProductsWithFavorites("products", ids || []);
      }
    };

    fetchData();
  }, [userId, fetchFavoriteIds, setProductsWithFavorites]);



  console.log('favorites id from products page', favoriteIds)



  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col md:flex-row pb-20">
        {/* <div className="hidden lg:inline-flex w-[30%] max-w-[300px] mt-4 h-full shrink-0">
          <ShopSideNav />
        </div> */}
        <div
          className="
            hidden lg:flex 
            w-[30%] max-w-[300px] mt-4 shrink-0
            sticky top-24
            max-h-[calc(100vh-6rem)]
            overflow-y-auto
            overflow-x-hidden
            no-scrollbar
          "
        >
          <ShopSideNav />
        </div>


        <MobileCategoryNav />
        <div className="grid flex-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:px-0 mb-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row pb-20">
      {/* <div className="hidden lg:inline-flex w-[30%] max-w-[300px] mt-4 h-full shrink-0">
        <ShopSideNav />
      </div> */}
      <div
        className="
          hidden lg:flex
          w-[30%] max-w-[300px] mt-4 shrink-0
          sticky top-24
          max-h-[calc(100vh-6rem)]
          overflow-y-auto
          no-scrollbar
        "
      >
        <ShopSideNav />
      </div>



      <MobileCategoryNav />

      <div className="mx-4 my-4 flex-1 flex justify-center relative">
        <PaginatedProducts/>
      </div>
    </div>
  );

};

export default Product;
