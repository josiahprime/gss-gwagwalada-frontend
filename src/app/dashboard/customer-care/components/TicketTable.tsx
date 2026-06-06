import type { Ticket } from 'store/ticket/ticketTypes';
import TicketRow from './TicketRow';
import { Inbox } from 'lucide-react';
import TicketTableSkeleton from '../../components/ui/TicketTableSkeleton/TicketTableSkeleton';

interface TicketTableProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onTicketSelect: (ticket: Ticket) => void;
  loading: boolean;
}

export function TicketTable({
  tickets,
  selectedTicketId,
  onTicketSelect,
  loading = false,
}: TicketTableProps) {

  if (loading) {
    return <TicketTableSkeleton />;
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl py-16 border border-gray-200 bg-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <Inbox className="h-7 w-7 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-800">No tickets found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-sm overflow-hidden border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Ticket ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Customer
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created
            </th>
            <th className="w-10 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketSelect}
              isSelected={selectedTicketId === ticket.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
