"use client";


import { useState, useEffect, useMemo } from "react";
import { Headset, AlertCircle } from "lucide-react";
import { Ticket, TicketStatus, TicketPriority, TicketCategory, Message } from "store/ticket/ticketTypes";
import { useThemeStore } from "store/theme/themeStore";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import SupportStats from "./components/SupportStats";
import { TicketControls } from "./components/TicketControls";
import { TicketTable } from "./components/TicketTable";
import TicketDetailsDrawer from "./components/TicketDetailsDrawer";
import { useTicketStore } from "@/store/ticket/useTicketStore";


interface FilterState {
  status: TicketStatus[];
  priority: TicketPriority[];
  category: TicketCategory[];
}

export default function CustomerCarePage() {
  const {
    tickets,
    selectedTicket,    // Now coming from Zustand
    selectTicket,
    fetchAllTickets,
    sendReply,
    markAsRead,
    fetchTicketById,
    assignTicket,
    escalateTicket,
    resolveTicket,
    loading,
  } = useTicketStore();

   // Fetch tickets on mount
    useEffect(() => {
      fetchAllTickets(); // store updates directly

      // initialize socket once
      useTicketStore.getState().initSocket();

    }, [fetchAllTickets]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    category: [],
  });
  // const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const theme = useThemeStore((s) => s.theme);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.customerName.toLowerCase().includes(searchLower) ||
        ticket.customerEmail.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower);

      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(ticket.status);

      const matchesPriority =
        filters.priority.length === 0 || filters.priority.includes(ticket.priority);

      const matchesCategory =
        filters.category.length === 0 || filters.category.includes(ticket.category);

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchQuery, filters]);



  const handleTicketSelect = async (ticket: Ticket) => {
    // setSelectedTicket(ticket);
    await fetchTicketById(ticket.id);
    
    // markAsRead(ticket.id); // This clears the green dot instantly
  };
  
  const handleCloseDrawer = () => {
    // Clear the selection in the store to close the drawer
    selectTicket(null);
  };

  const handleSendReply = async (ticketId: string, content: string) => {
    await sendReply(ticketId, content);
  };


  const handleAssign = async (ticketId: string) => {
    await assignTicket(ticketId);
  };

  const handleEscalate = async (ticketId: string) => {
    await escalateTicket(ticketId);
  };

  const handleResolve = async (ticketId: string) => {
    await resolveTicket(ticketId);
  };

  return (
    <div
        className={`shadow-md p-4 m-4 min-h-[86dvh] rounded-lg transition-colors duration-500
         ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <DashboardHeader
          title="Customer Care"
          description="Manage customer inquiries, complaints, and support tickets"
          badgeText="Admin Support"
          BadgeIcon={Headset}
          infoLabel="Open Tickets: 12"
          InfoIcon={AlertCircle}
        />

        {/* Stats */}
        <SupportStats/>

        {/* Controls */}
        <TicketControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Ticket Table */}
        <TicketTable
          tickets={filteredTickets}
          selectedTicketId={selectedTicket?.id ?? null}
          onTicketSelect={handleTicketSelect}
          loading={loading}
        />

      </div>

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <TicketDetailsDrawer
          ticket={selectedTicket}
          isOpen={!!selectedTicket}
          onClose={handleCloseDrawer}
          onSendReply={handleSendReply}
          onAssign={handleAssign}
          onEscalate={handleEscalate}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}

