"use client";
import React, { useState, useEffect } from "react";
import { useOrderStore } from "store/order/useOrderStore";
import OrderTable from "./OrderTable";
import type { Order } from "store/order/orderTypes";
import { useRouter } from "next/navigation";
import { useThemeStore } from "store/theme/themeStore";

const DeliveryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    dateRange: null,
  });

  const orders = useOrderStore((state) => state.orders);
  const error = useOrderStore((state) => state.error);
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const theme = useThemeStore((s) => s.theme);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600">
            Oops! Something went wrong.
          </h2>
          <p className="text-red-400 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`shadow-md p-4 m-4 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      {/* Orders Overview */}
      <div
        className={`${
          selectedOrder ? "lg:col-span-2" : "lg:col-span-3"
        }`}
      >
        <OrderTable
          orders={orders}
          filters={filters}
          setFilters={setFilters}
          onOrderSelect={setSelectedOrder} // ✅ Pass handler
        />
      </div>

      {/* Order Details */}
      {selectedOrder && (
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          {/* <OrderDetails order={selectedOrder} /> */}
          <button onClick={() => router.push(`/delivery/order-details/${selectedOrder.id}`)}>
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;
