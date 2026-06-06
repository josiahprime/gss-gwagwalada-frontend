import type { Ticket } from "store/ticket/ticketTypes";
import { EmptyState } from "./EmptyState";
import { CustomerTicketCard } from "./CustomerTicketCard";

interface Props {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
  loading?: boolean; // optional
}

export function CustomerTickets({ tickets, onTicketClick, loading }: Props) {
  

  if (tickets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Your Tickets</h2>
      {tickets.map((ticket) => (
        <CustomerTicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={() => onTicketClick(ticket.id)}
          loading={loading} // pass down
        />
      ))}
    </div>
  );
}

