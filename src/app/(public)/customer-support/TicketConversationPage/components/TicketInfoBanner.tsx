import { ArrowLeft } from 'lucide-react';
import type { Ticket } from '@/store/ticket/ticketTypes';
import { categories } from '../../data/mockTickets';
// import { Ticket, categories } from '@/data/mockTickets';

interface TicketInfoBannerProps {
  ticket: Ticket;
  onBack: () => void;
}

const TicketInfoBanner = ({ ticket, onBack }: TicketInfoBannerProps) => {
  const categoryLabel = categories.find(c => c.value === ticket.category)?.label || ticket.category;

  const statusExplanations: Record<string, string> = {
    open: 'Our support team is reviewing your message.',
    pending: 'Our support team has replied and is waiting for your response.',
    resolved: 'This ticket has been marked as resolved.',
    closed: 'This ticket is closed and can no longer be replied to.' // 👈 Add this
  };

  const statusStyles: Record<string, string> = {
    open: 'bg-amber-50 border-amber-200',
    pending: 'bg-green-50 border-green-200',
    resolved: 'bg-gray-50 border-gray-200',
    closed: 'bg-red-50 border-red-200' // 👈 Add this (or whatever colors you prefer)
  };

  return (
    <div className="px-6 py-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to tickets</span>
      </button>

      <div className={`p-4 rounded-xl border ${statusStyles[ticket.status]}`}>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-sm font-mono text-gray-500">{ticket.id}</span>
          <span className="text-sm px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
            {categoryLabel}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">{ticket.subject}</h1>
        <p className="text-sm text-gray-600">{statusExplanations[ticket.status]}</p>
      </div>
    </div>
  );
};

export default TicketInfoBanner;
