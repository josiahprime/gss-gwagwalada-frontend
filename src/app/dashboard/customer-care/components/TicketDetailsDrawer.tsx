import { X } from "lucide-react";
import TicketMeta from "./TicketMeta";
import MessageThread from "./MessageThread";
import ReplyBox from "./ReplyBox";
import { TicketActions } from "./TicketActions";
import { Ticket } from "@/store/ticket/ticketTypes";   
import { useTicketStore } from "@/store/ticket/useTicketStore"; 
import { useAuthStore } from "@/store/auth/useAuthStore"; // 1. Import Auth
import { useEffect, useRef } from "react"; // 2. Add useRef
import socket from "@/lib/socket";

export default function TicketDetailsDrawer({
  ticket: initialTicket,
  isOpen,
  onClose,
  onSendReply,
  onAssign,
  onEscalate,
  onResolve,
}: {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (ticketId: string, content: string) => void;
  onAssign: (ticketId: string) => void;
  onEscalate: (ticketId: string) => void;
  onResolve: (ticketId: string) => void;
}) {
  const liveTicket = useTicketStore((state) => 
    state.tickets.find(t => t.id === initialTicket?.id) || initialTicket
  );

  // 3. Get UI state and Auth user
  const { updateTicket, isTyping, typingUser } = useTicketStore();
  const authUser = useAuthStore((state) => state.authUser);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Create the typing logic
  const handleInputChange = () => {
    if (!liveTicket?.id || !authUser?.username) return;

    socket.emit('typing', { ticketId: liveTicket.id, username: authUser.username });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { ticketId: liveTicket.id });
    }, 2000);
  };

  useEffect(() => {
    if (!liveTicket?.id || !socket) return;

    socket.emit('joinTicket', liveTicket.id);

    const handleUpdate = (updatedTicket: Ticket) => {
      if (updatedTicket.id === liveTicket.id) {
        updateTicket(updatedTicket);
      }
    };

    socket.on('ticketUpdated', handleUpdate);

    return () => {
      socket.emit('leaveTicket', liveTicket.id);
      socket.off('ticketUpdated', handleUpdate);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); // Cleanup timer
    };
  }, [liveTicket?.id]);

  if (!isOpen || !liveTicket) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />

      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-white border-l border-gray-200 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">{liveTicket.id}</h2>
            <p className="text-sm text-gray-500 truncate">{liveTicket.subject}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 transition">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <TicketMeta ticket={liveTicket} />
          <div className="h-px bg-gray-200" />

          <section>
            <h3 className="mb-4 text-sm font-medium text-gray-900">Conversation</h3>
            <MessageThread messages={liveTicket.messages} />
            
            {/* 5. UI INDICATOR: Show when customer is typing to admin */}
            {isTyping && (
              <div className="mt-2 text-xs text-gray-500 italic animate-pulse flex items-center gap-2">
                <span className="flex gap-1">
                   <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                </span>
                {typingUser} is typing...
              </div>
            )}
          </section>
        </main>

        <footer className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
          <TicketActions
            status={liveTicket.status}
            priority={liveTicket.priority}
            onAssign={() => onAssign(liveTicket.id)}
            onEscalate={() => onEscalate(liveTicket.id)}
            onResolve={() => onResolve(liveTicket.id)}
          />

          <div className="h-px bg-gray-200" />

          <ReplyBox
            disabled={liveTicket.status === "closed" || liveTicket.status === "resolved"}
            onSendReply={(content) => {
              // 6. Force stop typing when sending
              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
              socket.emit('stopTyping', { ticketId: liveTicket.id });
              onSendReply(liveTicket.id, content);
            }}
            onType={handleInputChange} // 7. Pass to ReplyBox
          />
        </footer>
      </aside>
    </>
  );
}