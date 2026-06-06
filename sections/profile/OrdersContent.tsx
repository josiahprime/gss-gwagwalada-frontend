// src/app/pages/account/orders/OrdersContent.js (or wherever it lives)
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useOrderStore } from "store/order/useOrderStore";
import { InfiniteScroll } from "app/components/InfiniteScroll"; // Assuming this handles view pagination
import OrderCard from "app/components/orders/OrderCard";
import { OrderCardSkeleton } from "app/components/ui/OrderCardSkeleton";
import NoOrders from "app/components/orders/NoOrders";

export default function OrdersContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // ⚠️ NOTE: getUserOrders should be updated to handle pagination on the server.
  const getUserOrders = useOrderStore((state) => state.getUserOrders);
  const userOrders = useOrderStore((state) => state.userOrders);
  const loading = useOrderStore((state) => state.loading); 
  
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section") ?? "account";

  // Initial fetch (ideally, this fetches only the first page of data)
  useEffect(() => {
    if (userOrders.length > 0) {
      console.log("📦 All user orders:", userOrders);
    }
    // If you are using server-side pagination (recommended), this should 
    // be updated to call a function like fetchOrdersPage(1, activeTab, searchQuery)
    if (userOrders.length === 0) getUserOrders();
  }, [getUserOrders, userOrders.length, userOrders]);

  // Client-side filtering (OK for small/medium lists, but use server-side for large lists)
  const filteredOrders = userOrders.filter((order) => {
    const matchSearch =
      order.id.includes(searchQuery) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchTab = activeTab === "all" ? true : order.fulfillmentStatus === activeTab;
    return matchSearch && matchTab;
  });


  // const totalOrdersValue = userOrders.reduce((sumOrders, order) => {
  //   const orderTotal = order.items.reduce((sumItems, item) => {
  //     return sumItems + item.unitPriceInKobo * item.quantity;
  //   }, 0);
  //   return sumOrders + orderTotal;
  // }, 0);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="text-white/80 text-sm">Track, manage, and review your recent purchases.</p>
        </div>
        <button className="text-sm text-white/80 font-medium hover:underline">
          Deleted Orders
        </button>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex sm:grid sm:grid-cols-5 gap-2 sm:gap-0 overflow-x-auto scrollbar-hide rounded-2xl border border-gray-200 shadow-sm bg-white p-2 sm:p-0 no-scrollbar">
          {[
            { label: "All", value: "all" },
            { label: "Processing", value: "processing" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Completed", value: "completed" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-full sm:rounded-none transition-all whitespace-nowrap 
                ${
                  activeTab === tab.value
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md sm:border-b-2 sm:border-emerald-600"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 sm:bg-white sm:hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by order ID or product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 w-full h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="border border-gray-200 text-sm rounded-xl px-4 py-2 bg-white hover:bg-gray-100">
          All / Last year
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => <OrderCardSkeleton key={idx} />)
          : filteredOrders.length === 0
          ? <NoOrders />
          : (
              <InfiniteScroll
              key={activeTab + searchQuery} 
              items={filteredOrders}
              initialItems={4} 
              loadCount={4} 
              renderItem={(order) => {
                const orderTotal = order.items.reduce(
                  (sum, item) => sum + item.unitPriceInKobo * item.quantity,
                  0
                );

                return (
                  <OrderCard 
                    key={order.id}
                    order={order} 
                    currentSection={currentSection} 
                    totalOrdersValue={orderTotal} // per-order total
                  />
                );
              }}
/>

            )
        }
      </div>
    </div>
  );
}