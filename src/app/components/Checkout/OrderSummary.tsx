'use client'
import { ShoppingBag, TrendingUp } from "lucide-react";
import Skeleton from "../ui/Skeleton";
import { formatCurrency } from "utils/FormatCurrency";
import { useOrderStore } from "store/order/useOrderStore";
import Image from "next/image";
import { useEffect } from "react";


interface OrderItem {
  id: string;
  productName: string;
  image: string;
  priceInKobo: number;
  quantity: number;
  unitType: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  amount: number;
  calculationDone: boolean;
}





const OrderSummary = ({ items, calculationDone }: OrderSummaryProps) => {

  useEffect(() => {
    console.log("Hydration OK: OrderSummary");
  }, []);
  
  const preview = useOrderStore((state)=>(state.preview))

  console.log("calculationDone", calculationDone);
  console.log("preview", preview);


  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-white/20 h-fit sticky top-24">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-2xl">
          <ShoppingBag className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
          <p className="text-sm text-gray-600">{items.length} item{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="group">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="relative w-16 h-16">
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-cover rounded-xl shadow-sm"
                />
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-lg truncate group-hover:text-green-600 transition-colors">
                  {item.productName}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(item.priceInKobo)} {item.unitType}
                </p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  {formatCurrency(item.priceInKobo * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        {calculationDone && preview ? (
          <>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(preview.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{formatCurrency(preview.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax {(preview?.taxRate * 100).toFixed(1)}%</span>
              <span>{formatCurrency(preview.taxAmount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="md:text-xl text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  {formatCurrency(preview.total)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax</span>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-400">Total</span>
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="mt-10">
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>
          </>
        )}
      </div>


      {/* Trust Indicators */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-blue-800">Fast Delivery</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <ShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-purple-800">Quality Assured</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
