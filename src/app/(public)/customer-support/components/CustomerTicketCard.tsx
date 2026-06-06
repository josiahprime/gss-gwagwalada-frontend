import { ChevronRight, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Ticket } from "store/ticket/ticketTypes";
// import { useTicketStore } from "@/store/ticket/useTicketStore"; 

interface Props {
  ticket: Ticket;
  onClick: () => void;
  loading?: boolean;
}

export function CustomerTicketCard({ ticket, onClick, loading }: Props) {
  // 1. Check if this specific ticket ID is in the unread list
  const isUnread = ticket.isUnread;

  const statusStyles: Record<string, string> = {
    open: "bg-yellow-50 text-yellow-700",
    pending: "bg-blue-50 text-blue-700",
    resolved: "bg-green-50 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  const priorityStyles: Record<string, string> = {
    high: "bg-red-50 text-red-700",
    medium: "bg-orange-50 text-orange-700",
    low: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
          <Loader className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      )}

      <button
        onClick={onClick}
        className={`w-full flex flex-col justify-between p-4 rounded-xl border transition text-left relative 
          ${isUnread ? "border-green-500 bg-green-50/20 shadow-sm" : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"}`}
      >
        {/* 2. THE NOTIFICATION INDICATORS */}
        {isUnread && (
          <div className="absolute -top-2 -right-1 flex items-center gap-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
              New
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h3 className={`text-sm font-medium truncate ${isUnread ? "text-green-900" : "text-gray-900"}`}>
              {ticket.subject}
            </h3>
            <p className="text-xs text-gray-500 truncate">Ticket ID: {ticket.id}</p>
          </div>

          <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="rounded-md bg-gray-100 px-2 py-1">
            {ticket.category.replace("-", " ")}
          </span>

          <span className={`rounded-md px-2 py-1 ${priorityStyles[ticket.priority]}`}>
            {ticket.priority} priority
          </span>
          <p className="text-red-500 font-bold">Debug Unread: {String(isUnread)}</p>

          <span className="ml-auto text-gray-400 text-[10px]">
            Updated {formatDistanceToNow(new Date(ticket.updatedAt))} ago
          </span>

          <ChevronRight className={`w-5 h-5 shrink-0 ml-2 transition-colors ${isUnread ? "text-green-500" : "text-gray-400"}`} />
        </div>
      </button>
    </div>
  );
}
