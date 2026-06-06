import { useEffect, useRef } from 'react';
import socket from '@/lib/socket';
import TicketInfoBanner from './components/TicketInfoBanner';
import MessageThread from './components/messageThread/MessageThread';
import CustomerReplyBox from '././components/CustomerReplyBox';
import TicketStatusNotice from '././components/TicketStatusNotice';
import type { Ticket } from '@/store/ticket/ticketTypes';
import { useTicketStore } from '@/store/ticket/useTicketStore';
import { useAuthStore } from '@/store/auth/useAuthStore';
// import type { Ticket} from '../data/mockTickets';

interface TicketConversationPageProps {
  ticket: Ticket;
  onBack: () => void;
  onSendReply: (ticketId: string, message: string) => void;
}

const TicketConversationPage = ({ ticket, onBack, onSendReply }: TicketConversationPageProps) => {
  const { updateTicket, isTyping, typingUser } = useTicketStore();
  const authUser = useAuthStore((state)=>state.authUser)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendReply = (message: string) => {
    onSendReply(ticket.id, message);
  };

  useEffect(() => {
    if (!ticket?.id) return;

    // 1. Tell the server we are now looking at this specific ticket
    // This is what makes "Typing Indicators" work for the other person!
    socket.emit('joinTicket', ticket.id);

    return () => {
      // 2. Tell the server we stopped looking at it
      socket.emit('leaveTicket', ticket.id);
      
      // 3. We DON'T need socket.off('ticketUpdated') here 
      // because we aren't setting a listener here anymore.
    };
  }, [ticket?.id]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Tiny delay to allow DOM to finish painting
  }, [ticket.messages]);

  const handleInputChange = () => {
    if (!ticket?.id || !authUser?.username) return;

    // Emit typing event
    socket.emit('typing', { ticketId: ticket.id, username: authUser.username });

    // Reset the "stop" timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { ticketId: ticket.id });
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TicketInfoBanner ticket={ticket} onBack={onBack} />
      <TicketStatusNotice status={ticket.status} />
      <MessageThread messages={ticket.messages} />

      {/* <div ref={scrollRef} aria-hidden="true" /> */}

      {/* UI: Show when the OTHER person is typing */}
      {isTyping && (
        <div className="px-6 py-2 text-xs text-gray-500 italic animate-pulse">
          {typingUser} is typing...
        </div>
      )}

      {/* Move the anchor to the VERY bottom of the message area */}
      <div ref={scrollRef} aria-hidden="true" className="h-2" />

      <CustomerReplyBox
        disabled={ticket.status === 'resolved'}
        // onSend={handleSendReply}
        onSend={(msg) => {
          // Stop typing indicator immediately when sending
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          socket.emit('stopTyping', { ticketId: ticket.id });
          handleSendReply(msg);
        }}
        onType={handleInputChange} 
      />
    </div>
  );
};

export default TicketConversationPage;
