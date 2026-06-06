"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    Package,
    Star,
    MessageSquare,
    Copy,
    MapPin,
    Phone,
    Truck,
    Clock,
    RotateCcw,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrderStore } from "store/order/useOrderStore";
import OrderStatusProgress from "./OrderStatusProgress";
import { formatCurrency } from "utils/FormatCurrency";
import VirtualizedList from "app/components/orders/VirtualizedList";
import Image from "next/image";

interface OrderDetailsProps {
    orderId: string;
}

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
    const orders = useOrderStore((state) => state.orders);
    const fetchOrders = useOrderStore((state) => state.fetchOrders);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const order = orders.find((order) => order.id === orderId);
    const router = useRouter();

    // Recommended: Use a function to navigate back to the main orders list
    const handleBackToOrders = () => {
        router.push("/account?section=orders");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "processing":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-100 to-white">
                <p className="text-gray-600 text-lg font-medium">
                    Order not found or still loading...
                </p>
            </div>
        );
    }

    return (
        // 💡 MOBILE FIX: Use p-4 for mobile, then sm:p-6 for larger screens
        <div className="relative min-h-screen shadow rounded-md p-4 sm:p-6">
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back Button */}
                <button
                    onClick={handleBackToOrders} // 💡 IMPROVEMENT: Use the specific back function
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-4 sm:mb-6" // 💡 MOBILE FIX: Reduced margin
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </button>

                {/* Progress Bar */}
                <OrderStatusProgress fulfillmentStatus={order.fulfillmentStatus} />

                {/* The main grid switches from 1-column (mobile) to 3-columns (lg) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 sm:mt-8"> {/* 💡 MOBILE FIX: Reduced margin */}
                    {/* Main Content (takes full width on mobile) */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6"> {/* 💡 MOBILE FIX: Reduced space-y */}
                        
                        {/* Order Overview */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100" // 💡 MOBILE FIX: Reduced padding
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3 sm:gap-0"> {/* 💡 MOBILE FIX: Stack elements vertically on small screens */}
                                <div>
                                    {/* 💡 MOBILE FIX: Adjust heading size for mobile */}
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                        Order #{order.trackingId}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                        Placed on {order.createdAt}
                                    </p>
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                            order.fulfillmentStatus
                                        )}`}
                                    >
                                        {order.fulfillmentStatus || "Processing"}
                                    </span>
                                </div>

                                <div className="text-left sm:text-right mt-3 sm:mt-0"> {/* 💡 MOBILE FIX: Ensure price is legible */}
                                    <p className="text-xl sm:text-2xl font-bold text-emerald-700">
                                        {formatCurrency(order.pricing.total)}
                                    </p>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                </div>
                            </div>

                            {/* Info Row (Seller, Tracking, Delivery Status) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                {/* Seller Info */}
                                <div className="flex items-start gap-2"> {/* Changed items-center to items-start for stacking */}
                                    <Package className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm"> {/* 💡 MOBILE FIX: Explicitly set text size */}
                                            RichField Farms & SmokeHouse LTD
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs text-gray-600">5.0</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Tracking Number */}
                                <div className="flex items-start gap-2">
                                    <Truck className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium">Tracking Number</p>
                                        <p className="text-sm text-gray-600 break-words">{order.trackingId}</p> {/* 💡 MOBILE FIX: Allow text to wrap */}
                                    </div>
                                </div>
                                {/* Delivery Status */}
                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium">Delivery Status</p>
                                        <p className="text-sm text-green-600">
                                            Delivered May 10, 2024
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Items Section */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100" // 💡 MOBILE FIX: Reduced padding
                            whileHover={{ scale: 1.01 }}
                        >
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                Items in this order
                            </h2>

                            <VirtualizedList
                                items={order.items}
                                itemHeight={150} // approx height of each item in px
                                height={350} // 💡 MOBILE FIX: Slightly reduced height on mobile for better fit
                                renderItem={(item, index) => (
                                    <div key={index} className="px-1 sm:px-3 py-2"> {/* 💡 MOBILE FIX: Reduced padding */}
                                        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-2xl shadow-sm 
                                        hover:shadow-md border border-gray-100 transition-shadow mb-3 sm:mb-5"> {/* 💡 MOBILE FIX: Reduced spacing/padding */}
                                            
                                            {/* Product Image */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm flex items-center justify-center"> {/* 💡 MOBILE FIX: Slightly smaller image size */}
                                                <Image
                                                    src={item.image.url}
                                                    alt={item.productName}
                                                    width={96}
                                                    height={96}
                                                    className="rounded-xl object-cover w-full h-full"
                                                />
                                            </div>


                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm sm:text-base text-gray-900">{item.productName}</h3> {/* 💡 MOBILE FIX: Smaller heading */}
                                                <p className="text-xs text-gray-500">fresh</p>

                                                <div className="flex justify-between items-end mt-2"> {/* 💡 MOBILE FIX: Adjusted margin */}
                                                    <span className="text-xs sm:text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </span>

                                                    <div className="text-right space-y-0.5"> {/* 💡 MOBILE FIX: Reduced space-y */}
                                                        <p className="text-xs text-gray-500">
                                                            {formatCurrency(item.unitPriceInKobo)} per 
                                                            <span className="font-bold text-gray-800"> {item.unitType}</span>
                                                        </p>
                                                        <p className="font-semibold text-base text-emerald-700"> {/* 💡 MOBILE FIX: Slightly smaller price font */}
                                                            {formatCurrency(item.unitPriceInKobo * item.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                            
                            {/* Items Action Buttons */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-100">
                              {/* 1. Buy Again (Full width on mobile, Auto/Content width on desktop) */}
                              <button className="flex-1 min-w-[45%] lg:flex-none lg:min-w-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-center gap-1">
                                  <Package className="w-4 h-4" />
                                  Buy Again
                              </button>
                              
                              {/* 2. Rate Product (Full width on mobile, Auto/Content width on desktop) */}
                              <button className="flex-1 min-w-[45%] lg:flex-none lg:min-w-0 border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-center gap-1">
                                  <Star className="w-4 h-4" />
                                  Rate Product
                              </button>
                              
                              {/* 3. Contact Seller (Full width on mobile, Takes remaining space/grows on desktop) */}
                              <button className="w-full sm:flex-1 sm:min-w-0 lg:flex-1 border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  Contact Seller
                              </button>
                              
                              {/* 4. Return / Refund (Full width on mobile, Auto/Content width on desktop) */}
                              <button className="w-full sm:flex-1 sm:min-w-0 lg:flex-none lg:min-w-0 border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-center gap-1">
                                  <RotateCcw className="w-4 h-4" />
                                  Return / Refund
                              </button>
                          </div>
                        </motion.div>
                    </div>

                    {/* Sidebar / Supplementary Information */}
                    <div className="space-y-4 sm:space-y-6"> {/* 💡 MOBILE FIX: Reduced space-y */}
                        
                        {/* Delivery Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"> {/* 💡 MOBILE FIX: Reduced padding */}
                            <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                Delivery Information
                            </h3>
                            {order.shipping ? (
                                <div className="space-y-2 sm:space-y-3 text-sm"> {/* 💡 MOBILE FIX: Reduced space-y */}
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.name || "No name provided"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            <p className="text-gray-600">
                                                {order.shipping.phone || "No phone number"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        {order.deliveryType === "pickup" ? (
                                            <p className="text-gray-600">
                                                {order.shipping.pickupStation ||
                                                    "Pickup station not specified"}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-gray-600">
                                                    {order.shipping.address || "No address"}
                                                </p>
                                                <p className="text-gray-600">
                                                    {order.shipping.state || "Unknown state"}, Nigeria
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-sm">
                                    No delivery information available.
                                </p>
                            )}
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"> {/* 💡 MOBILE FIX: Reduced padding */}
                            <h3 className="font-semibold mb-3 text-gray-800">
                                Payment Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                {/* ... Pricing Details (no changes needed) ... */}
                                <div className="flex justify-between">
                                    <span>Item total</span>
                                    <span>{formatCurrency(order.pricing.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping fee</span>
                                    <span>{formatCurrency(order.pricing.shippingFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax Amount</span>
                                    <span>{formatCurrency(order.pricing.taxAmount)}</span>
                                </div>
                                <hr className="my-2 text-emerald-600" />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-emerald-700">
                                        {formatCurrency((order.pricing.total))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions (Need Help?) */}
                        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100"> {/* 💡 MOBILE FIX: Reduced padding */}
                            <h3 className="font-semibold mb-3 text-gray-800">Need Help?</h3>
                            <div className="space-y-2">
                                <button className="w-full border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-start gap-2">
                                    <Truck className="w-4 h-4" />
                                    Track Package
                                </button>
                                <button className="w-full border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-start gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Contact Support
                                </button>
                                <button className="w-full border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl px-4 py-2 flex items-center justify-start gap-2">
                                    <Copy className="w-4 h-4" />
                                    Copy Order ID
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default OrderDetails