import { CheckCircle, AlertCircle } from 'lucide-react';
import { TicketStatus } from '@/store/ticket/ticketTypes';

interface TicketStatusNoticeProps {
  status: TicketStatus;  // now allows "closed" too
}

const TicketStatusNotice = ({ status }: TicketStatusNoticeProps) => {
  if (status === 'resolved') {
    return (
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">
            This ticket has been marked as resolved. You may open a new ticket if needed.
          </span>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="px-6 py-3 bg-green-50 border-t border-green-100">
        <div className="flex items-center gap-2 text-green-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            We've replied! Please check the message above and respond if needed.
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default TicketStatusNotice;