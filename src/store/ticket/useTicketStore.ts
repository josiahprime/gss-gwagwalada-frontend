import { create } from "zustand";
import { TicketState, TicketActions } from "./ticketTypes";
import { createTicketActions } from "./createTicketActions";
import axiosInstance from "lib/axios";


export const useTicketStore = create<TicketState & TicketActions>()(
  (set, get, store) => ({
    tickets: [],
    loading: false,
    selectedTicket: null,
    error: undefined,
    sendingMessage: false,
    assigningTicket: false,
    escalatingTicket: false,
    resolvingTicket: false,

    // Add these to match your TicketState interface
    isTyping: false,
    typingUser: null,

    ...createTicketActions(axiosInstance)(set, get, store),
  })
);

