// src/app/pages/account/orders/OrderCard.tsx
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { ChevronRight, RotateCcw, Trash2, MapPin, Home } from "lucide-react";
import { formatCurrency } from "utils/FormatCurrency";

type OrderItem = {
  productName: string;
  quantity: number;
  unitPriceInKobo: number;
  image?: { url: string };
};

type Order = {
  id: string;
  items: OrderItem[];
  fulfillmentStatus: "processing" | "shipped" | "delivered" | "completed" | string;
  createdAt: string;
  estimatedDeliveryStart?: string | null;
  estimatedDeliveryEnd?: string | null;
  deliveryType?: "home" | "pickup";
};

type Props = {
  order: Order;
  currentSection: string;
  totalOrdersValue: number;
};

const statusLabels: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
};

function getStatusStyles(status: string) {
  const map: Record<string, { textColor: string; dotColor: string }> = {
    processing: {
      textColor: "text-amber-700",
      dotColor: "bg-amber-500",
    },
    shipped: {
      textColor: "text-blue-700",
      dotColor: "bg-blue-500",
    },
    delivered: {
      textColor: "text-green-700",
      dotColor: "bg-green-500",
    },
    completed: {
      textColor: "text-emerald-700",
      dotColor: "bg-emerald-500",
    },
  };

  return map[status] || map.processing;
}


export default function OrderCard({ order, currentSection, totalOrdersValue }: Props) {
  const router = useRouter(); 
  const firstItem = order.items[0];
  const remainingItemsCount = order.items.length - 1;

  const statusStyles = getStatusStyles(order.fulfillmentStatus);

  const onViewDetails = () =>
    router.push(`/account?section=${currentSection}&id=${order.id}`);

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const estStart = order.estimatedDeliveryStart
    ? new Date(order.estimatedDeliveryStart)
    : null;

  const estEnd = order.estimatedDeliveryEnd
    ? new Date(order.estimatedDeliveryEnd)
    : null;


  const formattedEstStart = estStart
    ? estStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    : null;

  const formattedEstEnd = estEnd
    ? estEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    : null;


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-gray-200 shadow-md rounded-lg bg-white overflow-hidden hover:border-green-300 transition-all"
    >
      {/* HEADER */}
      <div className="flex items-start gap-3 p-4 border-b border-gray-200">
        <div className={`w-2.5 h-2.5 rounded-full ${statusStyles.dotColor} mt-1.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
            <div>
              <h3 className={`text-sm font-bold ${statusStyles.textColor}`}>
                {statusLabels[order.fulfillmentStatus] || order.fulfillmentStatus}
              </h3>
              <p className="text-xs text-gray-500">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">
                {formatCurrency(totalOrdersValue)}
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="p-4 space-y-2">
        {firstItem && (
          <div className="flex gap-3">
            <div className="relative w-12 h-12 rounded-lg border border-gray-200 bg-gray-100">
              <div className="overflow-hidden rounded-lg w-full h-full">
                <Image
                  src={firstItem.image?.url || "/placeholder.jpg"}
                  width={48}
                  height={48}
                  alt={firstItem.productName}
                  className="object-cover w-full h-full"
                />
              </div>

              {remainingItemsCount > 0 && (
                <div
                  className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3
                  w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center
                  text-xs font-bold shadow-md"
                >
                  +{remainingItemsCount}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 line-clamp-1">
                {firstItem.productName}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Qty: <span className="font-semibold">{firstItem.quantity}</span>
                </p>

                <p className="text-sm font-semibold text-blue-600">
                  {formatCurrency(firstItem.unitPriceInKobo)}
                </p>
              </div>
            </div>
          </div>
        )}

        {remainingItemsCount > 0 && (
          <button
            onClick={onViewDetails}
            className="w-full text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors py-2 rounded-lg hover:bg-blue-50 text-left"
          >
            Total: {order.items.length} items
          </button>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
        {order.fulfillmentStatus === "delivered" ? (
          <>
            <button className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-gray-100 rounded-md transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900 m-0">
              Est. {formattedEstStart} - {formattedEstEnd}
            </p>
            <div className="text-left flex items-center gap-1">
              {order.deliveryType === "home" ? (
                <>
                  <Home className="w-3.5 h-3.5 text-green-600" />
                  <p className="text-xs text-green-600 m-0">Home</p>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <p className="text-xs text-blue-600 m-0">Pickup Station</p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {order.fulfillmentStatus !== "delivered" && (
          <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-gray-100 rounded-md transition-colors">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            Track
          </button>
        )}

        <button
          onClick={onViewDetails}
          className="inline-flex items-center px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        >
          Details
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </motion.div>
  );
}
