"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { Calendar, Package, ClipboardList } from "lucide-react";
import type { Order } from "store/order/orderTypes";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useThemeStore } from "store/theme/themeStore";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";

interface OrderTableProps {
  orders: Order[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onOrderSelect: (order: Order) => void;
}





interface Filters {
  status: string;
  search: string;
  dateRange: null;
}


const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  filters,
  setFilters,
}) => {

  const router = useRouter();
  const theme = useThemeStore((s) => s.theme);

  const filteredOrders = Array.isArray(orders)
  ? orders.filter((order) => {
      return (
        (filters.status ? order.status === filters.status : true) &&
        (filters.search
          ? order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.items.some((item) =>
              item.productName
                .toLowerCase()
                .includes(filters.search.toLowerCase())
            )
          : true)
      );
    })
  : [];


  return (
    
  <div className="overflow-x-auto">
    <div className="min-h-screen py-8 px-4 sm:px-10">
      {/* Header */}
      <DashboardHeader
        title="Delivery Management"
        BadgeIcon={ClipboardList}              // Represents tasks/orders
        badgeText="Delivery Management"
        description="Select an order to manage delivery, update status, or view details."
        infoLabel="View delivery tasks"
        InfoIcon={Package}                     // Represents a package/order
      />

      {/* Filters */}
      <div className={`rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${theme === 'light' ? "bg-white border-gray-300" : 'bg-gray-900 border-gray-200'}`}>
        <div className="flex gap-4 flex-1 w-full">
          <select
            className={`
              px-4 py-2 rounded-xl text-sm shadow-inner
              ${theme === "light"
                ? "bg-white text-gray-800 placeholder-gray-400"
                : "bg-gray-800 text-gray-100 placeholder-gray-500"
              }
            `}

            value={filters.status}
            onChange={(e) =>
              setFilters((prev: Filters) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All Statuses</option>
            <option value="Delivered">Delivered</option>
            <option value="Shipped">Shipped</option>
            <option value="Processing">Processing</option>
            <option value="Canceled">Canceled</option>
          </select>

          <input
            type="text"
            placeholder="Search orders, customers, or products..."
            className={`
              px-4 py-2 rounded-xl text-sm shadow-inner
              ${theme === "light"
                ? "bg-white text-gray-800 placeholder-gray-400"
                : "bg-gray-800 text-gray-100 placeholder-gray-500"
              }
            `}

            value={filters.search}
            onChange={(e) =>
              setFilters((prev: Filters) => ({ ...prev, search: e.target.value }))
            }
          />
        </div>

        <div className={`flex items-center text-sm px-3 py-2 rounded-lg shadow-sm ${theme === 'light' ? "bg-white border-gray-300" : 'bg-gray-800 border-gray-200'}`}>
          <Package className="w-4 h-4 mr-2" />
          {filteredOrders.length} order{filteredOrders.length !== 1 && "s"} found
        </div>
      </div>

      {/* Table */}
      
        <div
          className={`overflow-hidden  rounded-xl shadow-xl transition-colors duration-500 ${
            theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
          }`}
        >
          <table className="w-full text-sm">
            <thead className={theme === "dark" ? "bg-gray-900 text-gray-300 rounded-t-xl" : "bg-gray-100 text-gray-700 rounded-t-xl"}>
              <tr>
                <th className="text-left px-6 py-4 w-[300px]">Product</th> {/* wider */}
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-800 divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`border-b transition-colors duration-500 ${
                      theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                    }`}>
                  
                  <td className="px-4 py-3">
                    <div className="flex gap-3 items-center">
                      <div className="relative">
                        {order.items?.[0]?.image?.url ? (
                          <Image
                            src={order.items[0].image.url}
                            alt={order.items[0].productName || "Product image"}
                            width={64}
                            height={64}
                            className="object-cover rounded-xl shadow-sm"
                          />

                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl shadow-sm">
                            <ImageOff className="w-6 h-6 text-gray-400" />
                          </div>
                        )}

                        {order.items.length > 1 && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 text-[10px] bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                            +{order.items.length - 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{order.items[0].productName}</div>
                        {order.items.length > 1 && (
                          <div className="text-xs text-gray-400">and {order.items.length - 1} more item</div>
                        )}
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Qty:{" "}
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`inline-block font-mono px-2 py-1 rounded-md text-xs ${theme === "dark"
                    ? "bg-gray-500 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {order.trackingId}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <div className="font-medium font-sans">{order.name}</div>
                    <div className="text-xs text-gray-500 font">{order.email}</div>
                    <div className="text-xs text-gray-400">{order.shipping.phone}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        order.status === "paid"
                          ? "bg-green-600"
                          : order.status === "pending"
                          ? "bg-yellow-600"
                          : order.status === "failed"
                          ? "bg-red-600"
                          : order.status === "cancelled"
                          ? "bg-gray-600"
                          // : order.status === "refunded"
                          // ? "bg-blue-600"
                          : ''
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      {/* <DollarSign className="w-4 h-4" /> */}
                      <span>₦{order.amount.toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/delivery/order-details/${order.trackingId}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2 py-2 rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaEye size={14} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className={theme === "dark" ? "text-gray-600" : "text-gray-300"} />
              <h3 className={theme === "dark" ? "text-gray-200" : "text-gray-800"} />
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            </div>
          )}
        </div>
      
    </div>
  </div>
  );
};

export default OrderTable;
