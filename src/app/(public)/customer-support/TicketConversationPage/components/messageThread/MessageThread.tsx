"use client";

import { useEffect, useRef } from "react";
import MessageBubble from './components/MessageBubble';
import type { Message } from '@/store/ticket/ticketTypes';

interface MessageThreadProps {
  messages: Message[];
}

const MessageThread = ({ messages }: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ This is the "magic" that keeps the chat at the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {/* ✅ The invisible anchor at the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageThread;