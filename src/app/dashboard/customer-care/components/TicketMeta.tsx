import { format } from "date-fns";
import { User, Tag, Calendar, UserCheck } from "lucide-react";
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from "store/ticket/ticketTypes"


interface TicketMetaProps {
  ticket: Ticket;
}

const priorityConfig: Record<
  TicketPriority,
  { label: string; badge: string }
> = {
  high: {
    label: "High",
    badge: "bg-red-50 text-red-600 border border-red-200",
  },
  medium: {
    label: "Medium",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  low: {
    label: "Low",
    badge: "bg-green-50 text-green-600 border border-green-200",
  },
};

const statusConfig: Record<
  TicketStatus,
  { label: string; badge: string }
> = {
  open: {
    label: "Open",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  pending: {
    label: "Pending",
    badge: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-green-50 text-green-600 border border-green-200",
  },
  closed: {
    label: "Closed",
    badge: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

const categoryLabels: Record<TicketCategory, string> = {
  "order-issue": "Order Issue",
  payment: "Payment",
  delivery: "Delivery",
  "product-quality": "Product Quality",
  account: "Account",
  refund: "Refund",
  general: "General",
};

export default function TicketMeta({ ticket }: TicketMetaProps) {
  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      {/* Customer */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <User className="h-5 w-5 text-green-700" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">
            {ticket.customerName}
          </p>
          <p className="truncate text-sm text-gray-500">
            {ticket.customerEmail}
          </p>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Tag className="h-3 w-3" />
            Category
          </div>
          <p className="text-sm font-medium text-gray-900">
            {categoryLabels[ticket.category]}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            Created
          </div>
          <p className="text-sm font-medium text-gray-900">
            {format(ticket.createdAt, "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.badge}`}
        >
          {priority.label} Priority
        </span>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badge}`}
        >
          {status.label}
        </span>
      </div>

      {/* Assigned */}
      {ticket.assignedTo && (
        <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 border border-gray-200">
          <UserCheck className="h-4 w-4 text-green-700" />
          <span className="text-sm text-gray-900">
            Assigned to{" "}
            <span className="font-medium">{ticket.assignedTo}</span>
          </span>
        </div>
      )}
    </div>
  );
}
