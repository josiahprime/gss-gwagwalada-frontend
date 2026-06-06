"use client";

import { useEffect, useState } from "react";
import type { Ticket } from "store/ticket/ticketTypes";
import { SupportHeader } from "./components/SupportHeader";
import { SupportIntro } from "./components/SupportIntro";
import { NewTicketForm } from "./components/NewTicketForm";
import { CustomerTickets } from "./components/CustomerTickets";
import TicketConversationPage from "./TicketConversationPage/TicketConversationPage";
import { useTicketStore } from "@/store/ticket/useTicketStore";

export default function CustomerSupportPage() {
  const { tickets, fetchMyTickets, createTicket, initSocket, sendReply, loading } = useTicketStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = tickets?.find(t => t.id === selectedTicketId);

  // Fetch tickets on mount
  useEffect(() => {
    fetchMyTickets();
    useTicketStore.getState().initSocket();
  }, [fetchMyTickets, initSocket]);

  // Create a new ticket
  async function handleCreateTicket(ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt">) {
    try {
      const newTicket = await createTicket(ticketData);
      setSelectedTicketId(newTicket.id);
    } catch (err) {
      console.error("Failed to create ticket:", err);
    }
  }

  const handleTicketClick = (id: string) => {
    // markAsRead(id);          
    setSelectedTicketId(id); // 2. Open the ticket
  };

  // Send a reply
  async function handleSendReply(ticketId: string, message: string) {
    try {
      await sendReply(ticketId, message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  // If a ticket is selected, show the conversation page
  if (selectedTicket) {
    return (
      <TicketConversationPage
        ticket={selectedTicket}
        onBack={() => setSelectedTicketId(null)}
        onSendReply={handleSendReply}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <SupportHeader />
        <SupportIntro />
        <NewTicketForm onCreateTicket={handleCreateTicket} />

        {loading || !tickets ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 animate-pulse">
              Loading your tickets...
            </h2>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <CustomerTickets
            tickets={tickets}
            onTicketClick={handleTicketClick} 
            loading={loading}
          />
        )}

      </div>
    </div>
  );
}
