import { format } from "date-fns";
// import { useTicketStore } from "@/store/ticket/useTicketStore";
import { ChevronRight } from "lucide-react";

const priorityConfig = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
  low: "bg-green-50 text-green-600 border-green-200",
};

const statusConfig = {
  open: "bg-yellow-50 text-yellow-600 border-yellow-200",
  pending: "bg-blue-50 text-blue-600 border-blue-200",
  resolved: "bg-green-50 text-green-600 border-green-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const categoryLabels: Record<string, string> = {
  "order_issue": "Order Issue",      // Match the DB log
  "order-issue": "Order Issue",      // Keep for safety
  "payment": "Payment",
  "delivery": "Delivery",
  "product_quality": "Product Quality", // Match the DB log
  "product-quality": "Product Quality", // Keep for safety
  "account": "Account",
  "refund": "Refund",
  "general": "General",
};

export default function TicketRow({
  ticket,
  onClick,
  isSelected,
}: {
  ticket: any;
  onClick: (ticket: any) => void;
  isSelected: boolean;
}) {
  const isUnread = ticket.isUnread;
  return (
    <tr
      onClick={() => onClick(ticket)}
      className={`cursor-pointer transition-colors relative
        ${isSelected ? "bg-green-50" : "hover:bg-gray-50"}
        ${isUnread ? "font-semibold" : ""} 
      `}
    >
      <td className="px-4 py-3 font-mono text-sm font-medium text-green-700 relative">
        {/* THE GREEN DOT */}
        {isUnread && (
          <span className="absolute left-1 top-1/2 -translate-y-1/2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
          </span>
        )}
        <span className={isUnread ? "pl-3" : ""}>{ticket.id}</span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">      
          {/* 1.show the Customer Name */}
          <p className="font-medium text-gray-900">{ticket.customerName}</p>

          {/* 2. Then show the "New" badge if unread */}
          {isUnread && (
            <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
              New
            </span>
          )}
        </div>
        
        {/* 3. Subtext remains underneath */}
        <p className="text-xs text-gray-500">{ticket.customerEmail}</p>
      </td>

      <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500">
        {categoryLabels[ticket.category]}
      </td>

      <td className="hidden sm:table-cell px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium
            ${priorityConfig[ticket.priority as keyof typeof priorityConfig]}
          `}
        >
          {ticket.priority}
        </span>
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium
            ${statusConfig[ticket.status as keyof typeof statusConfig]}
          `}
        >
          {ticket.status}
        </span>
      </td>

      <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-500">
        {format(ticket.createdAt, "MMM d, yyyy")}
      </td>

      <td className="px-4 py-3 text-right">
        <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
      </td>
    </tr>
  );
}
