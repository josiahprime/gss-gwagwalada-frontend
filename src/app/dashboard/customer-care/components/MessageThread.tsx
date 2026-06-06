"use client";


import { format } from "date-fns";
import type { Message } from "store/ticket/ticketTypes";
import { User, Headphones } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth/useAuthStore";

interface MessageThreadProps {
  messages: Message[];
}

export default function MessageThread({ messages }: MessageThreadProps) {
  const authUser = useAuthStore((state) => state.authUser);

  // ✅ Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === authUser?.id;
        const isAdmin = message.sender?.role === "admin";

        return (
          <div
            key={message.id}
            className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                ${isAdmin ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {isAdmin ? <Headphones className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>

            {/* Message */}
            <div className={`flex max-w-[80%] flex-col gap-1 ${isOwnMessage ? "items-end text-right" : ""}`}>
              <div className="flex items-center gap-2">
                {!isOwnMessage && (
                  <span className="text-xs font-medium text-gray-900">
                    {message.sender?.username}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {format(new Date(message.createdAt), "MMM d, h:mm a")}
                </span>
              </div>

              <div className={`rounded-xl px-4 py-3 ${isOwnMessage ? "bg-green-50 text-gray-900" : "bg-gray-100 text-gray-900"}`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dummy div to scroll into view */}
      <div ref={messagesEndRef} />
    </div>
  );
}
