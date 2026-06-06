"use client";

import React, { useEffect } from "react";
import { useOrderStore } from "store/order/useOrderStore";
import { Order } from "store/order/orderTypes";
import { FaEye } from "react-icons/fa";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "utils/FormatCurrency";
import Image from "next/image";
import { useThemeStore } from "store/theme/themeStore";

const IMAGE_SIZE = 56;

const OrdersTable = () => {
  const router = useRouter();
  const loading = useOrderStore((state) => state.loading);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const orders = useOrderStore((state) => state.orders) as Order[];
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className={`p-6 text-center rounded-lg ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"} transition-colors duration-500`}>
        Loading orders...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className={`p-6 text-center rounded-lg ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"} transition-colors duration-500`}>
        No recent orders found.
      </div>
    );
  }

  const statusStyles: { [key: string]: string } = {
    Approved: theme === "dark" ? "bg-green-900 text-green-400" : "bg-green-100 text-green-700",
    Pending: theme === "dark" ? "bg-yellow-900 text-yellow-400" : "bg-yellow-100 text-yellow-700",
    Declined: theme === "dark" ? "bg-red-900 text-red-400" : "bg-red-100 text-red-700",
  };

  return (
    <div className={`rounded-xl p-6 overflow-x-auto shadow-xl ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"} transition-colors duration-500`}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>Latest Orders</h2>

      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className={`${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"} text-left`}>
            <th className="py-3 px-4">Tracking ID</th>
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const firstItem = order.items[0];
            const hasMultipleItems = order.items.length > 1;
            const additionalItemCount = order.items.length - 1;
            const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const orderTotal = order.items.reduce(
              (sum, item) => sum + item.unitPriceInKobo * item.quantity,
              0
            );

            return (
              <tr key={order.id} className={`${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} border-b transition-colors duration-500`}>
                <td className="py-3 px-4 font-medium">{order.trackingId}</td>

                <td className="px-6 py-4">
                  <div className="flex gap-3 items-center">
                    <div className="relative">
                      {firstItem?.image?.url ? (
                        <Image
                          src={firstItem.image.url}
                          alt={firstItem.productName || "Product image"}
                          width={IMAGE_SIZE}
                          height={IMAGE_SIZE}
                          className="object-cover rounded-xl shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6" }}>
                          <ImageOff className={`w-6 h-6 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`} />
                        </div>
                      )}

                      {hasMultipleItems && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                          +{additionalItemCount}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-medium">{firstItem.productName}</div>

                      {hasMultipleItems && (
                        <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-400"}`}>
                          and {additionalItemCount} more item(s)
                        </div>
                      )}

                      <div className={`text-xs font-medium mt-1 ${theme === "dark" ? "text-gray-200" : "text-blue-600"}`}>
                        Qty: {totalQuantity}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">{order.name}</td>

                <td className="py-3 px-4">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                <td className="py-3 px-4">{formatCurrency(orderTotal)}</td>

                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full font-semibold text-xs ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/delivery/order-details/${order.trackingId}`)
                    }
                    className={`${theme === "dark" ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} text-xs font-semibold px-2 py-2 rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap transition-colors duration-500`}
                  >
                    <FaEye size={14} />
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
