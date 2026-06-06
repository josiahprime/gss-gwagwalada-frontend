import { Message } from '@/store/ticket/ticketTypes';
import { User, Headphones } from 'lucide-react';
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth/useAuthStore";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const authUser = useAuthStore((state) => state.authUser);
  
  // Logic to determine state
  const isOwnMessage = message.senderId === authUser?.id;
  const isAdmin = message.sender?.role === 'admin';
  const senderName = isAdmin ? (message.sender?.username || 'Support') : message.sender?.username;

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full 
        ${isAdmin ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}>
        {isAdmin ? <Headphones className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Message Container */}
      <div className={`flex max-w-[80%] flex-col gap-1 ${isOwnMessage ? "items-end text-right" : ""}`}>
        
        {/* Header: Name and Date */}
        <div className="flex items-center gap-2">
          {!isOwnMessage && (
            <span className="text-xs font-medium text-gray-900">
              {senderName}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {format(new Date(message.createdAt), "MMM d, h:mm a")}
          </span>
        </div>

        {/* Bubble */}
        <div className={`rounded-xl px-4 py-3 ${
          isOwnMessage 
            ? "bg-green-50 text-gray-900 border border-green-100" 
            : "bg-gray-100 text-gray-900"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;


// tell am say based on your selina levels say you see say me i come their shop today