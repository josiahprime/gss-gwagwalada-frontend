"use client";
import React, { useEffect, useCallback } from "react";
import { Box, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "../components/products/ProductsCard/ProductsCard";
import { InfiniteScrollServer } from "app/components/ui/InfiniteScrollServer";
import DashboardProductCardSkeleton from "app/components/ui/DashboardProductCardSkeleton";
import { useProductStore } from "store/product/useProductStore";
import DashboardProductSearch from "../components/products/DashboardProductSearch/DashboardProductSearch";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import SearchEmptyState from "app/components/ui/SearchEmptyState";
import { useThemeStore } from "store/theme/themeStore";

const Products = () => {
  const {
    products,
    fetchProducts,
    hasMore,
    isLoading,
    isFetchingMore,
    query,
    setSearchQuery,
    setFilters,
    setCategory
  } = useProductStore();

  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const theme = useThemeStore((s) => s.theme);
  const router = useRouter();

  const isSearching = Boolean(query.search);

  const isFilterEmpty =
    !isLoading &&
    !isFetchingMore &&
    products.length === 0 &&
    (query.search?.trim() || query.category || query.minPrice != null || query.maxPrice != null);

  // 🔁 Fetch on query change
  useEffect(() => {
    fetchProducts({ caller: "dashboard-query-change" });
  }, [query.search, query.category, query.minPrice, query.maxPrice, fetchProducts]);

  const handleFetchMore = useCallback(() => {
    fetchProducts({ loadMore: true, caller: "dashboard-infinite-scroll" });
  }, [fetchProducts]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setCategory("");
    setFilters({ minPrice: undefined, maxPrice: undefined });
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/products/edit-product/${id}`);
  };

  const handleDelete = async (id: string) => {
    const snapshot = [...products];
    useProductStore.setState((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));

    try {
      await deleteProduct(id);
    } catch {
      useProductStore.setState({ products: snapshot });
    }
  };

  return (
    <div className={`shadow-md p-5 m-5 rounded-lg ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}>
      <div className="w-full min-h-screen px-4 py-6 md:px-8">
        {/* HEADER */}
        <DashboardHeader
          title="Products"
          description="Manage all your available products below"
          badgeText="Inventory"
          BadgeIcon={Box}
          actionLabel="+ Add Product"
          ActionIcon={Plus}
          onAction={() => router.push("/dashboard/products/add-products")}
        />

        {/* SEARCH BAR (new row below header for clarity) */}
        <div className="my-4 flex flex-col md:flex-row md:items-center gap-3">
          <DashboardProductSearch />
        </div>

        {/* Grid */}
        {isFilterEmpty ? (
          <SearchEmptyState onClear={handleClearSearch} theme={theme} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
            <InfiniteScrollServer
              items={products}
              fetchMore={handleFetchMore}
              hasMore={hasMore}
              isFetching={isLoading || isFetchingMore}
              loader={Array.from({ length: 8 }).map((_, i) => (
                <DashboardProductCardSkeleton key={i} />
              ))}
              renderItem={(product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageUrl={product.images[0]?.url || "/placeholder.jpg"}
                  title={product.productName}
                  price={product.priceInKobo}
                  stock={product.stock}
                  description={product.description}
                  onEdit={() => handleEdit(product.id)}
                  onDelete={() => handleDelete(product.id)}
                  theme={theme}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
