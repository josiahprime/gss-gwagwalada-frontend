"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import OrderStatusProgress from "../../OrderStatusProgress";
import StatusSwitcher from "./StatusSwitcher";
import { useOrderStore } from "store/order/useOrderStore";
import { motion } from "framer-motion";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

import {
  ArrowLeft,
  Package,
  Truck,
  DollarSign,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Box,
  Link,
  CheckCircle,
  Calendar,
  CreditCard,
} from "lucide-react";


type FulfillmentStatus = "Processing" | "Shipped" | "OutForDelivery" | "Delivered";

interface OrderStatProps {
  icon: LucideIcon; // from react-icons
  label: string;
  value: string | number;
  color: string;
}

const OrderDetailsPage: React.FC = () => {
  
  const router = useRouter();
  const { id } = useParams();
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus>("Processing");
  const [hasChanges, setHasChanges] = useState(false);
  const [status, setStatus] = useState('')
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const fetchOrders = useOrderStore((state)=>(state.fetchOrders))



  const order = orders.find((o) => o.trackingId === id);



  // useEffect(() => {
  //   fetchOrders().then(() => {
  //     const updatedOrder = useOrderStore.getState().orders.find(o => o.trackingId === id);
  //     setOrder(updatedOrder);
  //   });
  // }, [id]);

  console.log('order',order)

  useEffect(() => {
    if (order) {
      setFulfillmentStatus(order.fulfillmentStatus || "Processing");
      setStatus(order.status || 'pending')
    }
  }, [order]);

  useEffect(() => {
  if (order) {
    const changed = order.fulfillmentStatus !== fulfillmentStatus;
    setHasChanges(changed);
    console.log("Has changes:", changed);
  }
}, [fulfillmentStatus, order]);

  const handleFulfillmentChange = (status:FulfillmentStatus)=>{
    setFulfillmentStatus(status)
    console.log('current status', status)
  }

  // const handleApplyChanges = async () => {
  //   if (!order) return;
  //   try {
  //     await updateOrder(order.id, { status, fulfillmentStatus });
  //     setHasChanges(false);
  //   } catch (err) {
  //     console.error("Failed to update order", err);
  //   }
  // };

  const handleApplyChanges = async () => {
  if (!order) return;

  const toastId = toast.loading("Updating order...");

  // Convert "Out for Delivery" → "OutForDelivery"
  

  try {
    const response = await updateOrder(order.id, {
      status,
      fulfillmentStatus,
    });

    console.log("Update order response:", response);

    if (!response) {
    throw new Error("Update failed");
  }


    toast.success("Order updated successfully!", { id: toastId });
    setHasChanges(false);
    fetchOrders()
    console.log('updated orders',orders)
  } catch (error) {
    console.error("Error applying changes:", error);
    toast.error("Failed to update order.", { id: toastId });
  }
};



  

  if (loading) return <div className="p-6">Loading...</div>;
  if (!order) return <div className="p-6 text-red-500">Order not found.</div>;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      >
      <div className="p-6 max-w-6xl mx-auto min-h-screen">
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Orders
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.trackingId}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                Placed on{" "}
                {new Date(order.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            {getStatusBadge(order.fulfillmentStatus)}
          </div>
        </div>

        <div className="rounded-xl shadow-sm border-0 mb-6 bg-white p-0">
          <OrderStatusProgress currentStatus={fulfillmentStatus} />
        </div>

        <div className="rounded-xl shadow-sm border-0 mb-6 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Admin Controls</h3>
              <p className="text-sm text-gray-600">Update the order fulfillment status</p>
              
            </div>
            <StatusSwitcher
              currentStatus={fulfillmentStatus}
              onStatusChange={handleFulfillmentChange}
            />
          </div>
          {hasChanges && (
            
            <div className="text-right mt-4">
              <button
                onClick={handleApplyChanges}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-10 px-4 py-2"
              >
                Apply Changes
              </button>

            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="rounded-xl overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <User className="w-5 h-5" />
                  Customer Information
                </div>
              </div>
              <div className="p-0">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {order.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.name}</h3>
                      <p className="text-sm text-gray-600">Premium Customer</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <CustomerInfo icon={Mail} label="Email" value={order.email} color="green" />
                  <CustomerInfo icon={Phone} label="Phone" value={order.shipping.phone} color="purple" />
                  <CustomerInfo icon={MapPin} label="Address" value={order.shipping.address} color="orange" />
                </div>
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <OrderStat icon={Calendar} label="Order Date" value={new Date(order.createdAt).toLocaleDateString()} color="blue" />
                    <OrderStat icon={CreditCard} label="Payment" value="Completed" color="green" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl shadow-sm border-0 bg-white">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-xl p-4 font-semibold flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                Order Summary
              </div>
              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-600 text-sm">Total Amount</span>
                        </div>
                        <span className="text-xl font-bold text-emerald-600">
                          ₦{order.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-500 block mb-1">Transaction Reference</span>
                      <span className="font-mono font-medium text-sm">{order.tx_ref}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900 text-sm">Delivery Provider</span>
                        </div>
                        <span className="text-blue-700 text-sm">{order.deliveryProvider || 'DHL Logistics'}</span>
                      </div>
                    {order.deliveryTrackingUrl && (
                      <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-10 px-4 py-2 w-full">
                        <Link className="w-4 h-4 mr-2" />
                        Track Shipment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-sm border-0 bg-white">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl p-4 font-semibold flex items-center gap-2 text-lg">
                <Box className="w-5 h-5" />
                Order Items
              </div>
              <div className="p-0 overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-6 text-left font-medium text-muted-foreground">Product</th>
                      <th className="h-12 px-4 text-center font-medium text-muted-foreground">Quantity</th>
                      <th className="h-12 px-4 text-right font-medium text-muted-foreground">Unit Price</th>
                      <th className="h-12 px-6 text-right font-medium text-muted-foreground">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 pl-6 align-middle">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={item.image.url}
                                alt={item.productName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105 rounded-lg"
                              />

                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{item.productName}</div>
                              <div className="text-xs text-gray-500">Premium Quality • In Stock</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </td>
                        <td className="p-4 text-right">₦{item.unitPriceInKobo.toLocaleString()}</td>
                        <td className="p-4 pr-6 text-right font-bold text-gray-900">
                          ₦{(item.quantity * item.unitPriceInKobo).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-5 border-t text-right text-xl font-bold text-emerald-600">
                  Grand Total: ₦{order.amount.toLocaleString()}
                  <p className="text-sm font-normal text-gray-500">Including all fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CustomerInfo: React.FC<OrderStatProps> = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
      <Icon className={`w-4 h-4 text-${color}-600`} />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const OrderStat: React.FC<OrderStatProps> = ({ icon: Icon, label, value, color }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      <Icon className={`w-4 h-4 text-${color}-600`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);



type Status =
  | "paid"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const statusMap: Record<Status, string> = {
    paid: "bg-green-500 text-white border-transparent",
    pending: "bg-yellow-500 text-white border-transparent",
    processing: "bg-blue-500 text-white border-transparent",
    shipped: "bg-purple-500 text-white border-transparent",
    delivered: "bg-emerald-500 text-white border-transparent",
    cancelled: "bg-red-500 text-white border-transparent",
    failed: "bg-red-600 text-white border-transparent",
  };

  const normalizedStatus = status.toLowerCase() as Status;

  return (
    <div
      className={`${baseClasses} ${
        statusMap[normalizedStatus] || "bg-gray-500 text-white"
      }`}
    >
      <CheckCircle className="w-4 h-4 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};


export default OrderDetailsPage;


