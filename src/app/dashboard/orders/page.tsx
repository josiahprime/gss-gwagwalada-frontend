"use client"
import React, {useEffect} from "react";
import { Package, ClipboardList } from "lucide-react";
import { useOrderStore } from "store/order/useOrderStore";
import { useThemeStore } from "store/theme/themeStore";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";

const Orders = () => {

  const orders = useOrderStore((state)=>(state.orders))
  const error = useOrderStore((state)=>(state.error))
  const loading = useOrderStore((state)=>(state.loading))
  const fetchOrders = useOrderStore((state)=>(state.fetchOrders))
  const theme = useThemeStore((s) => s.theme);
  console.log(orders)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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
          <h2 className="text-xl font-semibold text-red-600">Oops! Something went wrong.</h2>
          <p className="text-red-400 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  const widgetTheme =
  theme === "dark"
    ? "bg-gray-900 text-gray-100"
    : "bg-white text-gray-800";

  return (
    <div
      className={`shadow-md p-5 m-5 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* DASHBOARD HEADER */}
        <div  className="px-6">
          <DashboardHeader
            title="Orders"
            BadgeIcon={ClipboardList} 
            description="Track and manage all your orders in one place"
            badgeText="Order Management"
            infoLabel="View orders"
            InfoIcon={Package}                   
          />
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div className={`shadow rounded-lg p-4 ${widgetTheme}`}>
            <h3 className="text-sm font-medium ">Total Orders</h3>
            <p className={`text-2xl font-semibold ${theme === 'dark' ? "text-white" : 'text-gray-800'}`}>102</p>
          </div>
          <div className={`shadow rounded-lg p-4 ${widgetTheme}`}>
            <h3 className="text-sm font-medium">Pending Orders</h3>
            <p className="text-2xl font-semibold text-yellow-500">12</p>
          </div>
          <div className={`shadow rounded-lg p-4 ${widgetTheme}`}>
            <h3 className="text-sm font-medium">Delivered Orders</h3>
            <p className="text-2xl font-semibold text-green-500">78</p>
          </div>
          <div className={`shadow rounded-lg p-4 ${widgetTheme}`}>
            <h3 className="text-sm font-medium text-gray-500">Canceled Orders</h3>
            <p className="text-2xl font-semibold text-red-500">8</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`flex justify-between items-center p-6 m-4 rounded-lg shadow ${widgetTheme}`}>
          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            className={`w-full md:w-1/3 p-2 border border-gray-300 rounded-md ${theme === 'light' ? "bg-white border-gray-300" : 'bg-gray-800 border-gray-200'}`}
          />
          <select className={`p-2 border rounded-md ml-4 ${theme === 'light' ? "bg-white border-gray-300" : 'bg-gray-800 border-gray-200'}`}>
            <option value="">Filter by Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-4">
            Add New Order
          </button> */}
        </div>

        {/* Orders Table */}
        
        <div className={`p-6 m-4 rounded-xl shadow-xl transition-colors duration-500 ${
          theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
        }`}>
          <h3 className="text-lg font-semibold mb-4">Current Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className={`${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"} text-left`}>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {orders.map((order, index) => (
                  <tr key={order.trackingId || index} 
                  className={`border-b transition-colors duration-500 ${
                    theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                  }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">#{order.trackingId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-semibold ${
                          order.status === "completed"
                            ? "text-green-600"
                            : order.status === "pending"
                            ? "text-yellow-600"
                            : order.status === 'failed'
                            ? "text-red-600"
                            : order.status === 'paid'
                            ? "text-blue-600" 
                            : ''
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ₦{order.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button className="text-blue-600 hover:underline">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Orders;
