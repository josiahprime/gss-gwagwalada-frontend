"use client";

import { useEffect, useCallback} from "react";
import { ProductCard } from "app/components/ProductCard/ProductCard";
import { InfiniteScrollServer } from "app/components/ui/InfiniteScrollServer";
import ProductCardSkeleton from "app/components/ui/ProductCardSkeleton";
import { useProductStore } from "store/product/useProductStore";
import SearchEmptyState from "app/components/ui/SearchEmptyState";




const PaginatedProducts: React.FC = () => {
  const {
    products,
    fetchProducts,
    hasMore,
    isLoading,
    isFetchingMore,
    query,
    setSearchQuery 
  } = useProductStore();


  


  const searchQuery = query.search;




  // const isSearching = Boolean(searchQuery);

  const isFilterEmpty =
  !isLoading &&
  !isFetchingMore &&
  products.length === 0 &&
  (query.search?.trim() || query.category || query.minPrice != null || query.maxPrice != null);






  console.log('products from pagination',products)


  



  useEffect(() => {
    console.log("[COMPONENT] useEffect trigger", {
      productsLength: products.length,
      query,
    });
    fetchProducts({ caller: "query-change" });
  }, [query.search, query.category,  query.minPrice, query.maxPrice, fetchProducts]);








  useEffect(() => {
    console.log("[COMPONENT] query changed:", query);
  }, [query]);


  const handleFetchMore = useCallback(async () => {
    fetchProducts({ loadMore: true, caller: "InfiniteScroll" });
  }, [fetchProducts]);

  let emptyType: "search" | "category" | "price" | "multiple" = "search";

  if ((query.minPrice || query.maxPrice) && (query.category || query.search)) {
    emptyType = "multiple"; // optional, can customize message for combined filters
  } else if (query.minPrice || query.maxPrice) {
    emptyType = "price";
  } else if (query.category) {
    emptyType = "category";
  } else if (query.search) {
    emptyType = "search";
  }





  // Show skeletons if products not loaded yet
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 md:px-0 mb-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }


  return (
    <>
    {isFilterEmpty ? (
      <div className="w-full p-4 md:px-0">
        <SearchEmptyState
          onClear={() => {
            setSearchQuery(""); // clear search
            useProductStore.getState().setFilters({ minPrice: undefined, maxPrice: undefined });
            // optionally reset category too
            useProductStore.getState().setCategory(""); 
          }}
          emptyType={emptyType}
          title="No products found"
          description={
            emptyType === "price"
            ? `No products found in ₦${query.minPrice ?? 0} - ₦${query.maxPrice ?? "∞"}`
            : emptyType === "category"
              ? `No products found in this category.`
              : emptyType === "multiple"
                ? `No products found matching your current filters.`
                : "We couldn’t find any products matching your search."
          }
        />
      </div>
    ) : (

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 md:px-0 mb-0">
        <InfiniteScrollServer
          items={products}
          fetchMore={handleFetchMore}
          hasMore={hasMore}
          isFetching={isLoading || isFetchingMore}
          loader={
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </>
          }
          renderItem={(product, index) => (
            <ProductCard
              key={product.id || index}
              productName={product.productName}
              description={
                product.description.length > 80
                  ? `${product.description.slice(0, 80)}...`
                  : product.description
              }
              id={product.id}
              image={product.images[0]?.url ?? "/placeholder.png"}
              rating={product.rating}
              priceInKobo={product.priceInKobo}
              unitType={product.unitType}
              isFavorite={product.isFavorite ?? false}
              discount={product.discount}
              stock={product.stock}
            />
          )}
        />
      </div>
      
  )}
  </>
  );

};

export default PaginatedProducts;
