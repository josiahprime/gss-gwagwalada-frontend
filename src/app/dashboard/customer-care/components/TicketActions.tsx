import { UserPlus, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { TicketStatus } from "store/ticket/ticketTypes";

interface TicketActionsProps {
  status: TicketStatus;
  onAssign: () => void;
  onEscalate: () => void;
  onResolve: () => void;
  priority: string;
}

export function TicketActions({ status, priority, onAssign, onEscalate, onResolve }: TicketActionsProps) {
  const isResolved = status === "resolved" || status === "closed";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Assign */}
      {status === "open" && (
        <button
          onClick={onAssign}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Assign
        </button>
      )}

      {/* Escalate */}
      {priority !== "high" && (
        <button
          onClick={onEscalate}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-yellow-400 text-yellow-500 hover:bg-yellow-50 transition-colors"
        >
          <ArrowUpCircle className="h-4 w-4" />
          Escalate
        </button>
      )}

      {/* Resolve */}
      <button
        onClick={onResolve}
        disabled={isResolved}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium border text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${isResolved ? "border-green-400 bg-green-50" : "border-green-400 hover:bg-green-50"}
        `}
      >
        <CheckCircle2 className="h-4 w-4" />
        {isResolved ? "Resolved" : "Resolve"}
      </button>
    </div>
  );
}
