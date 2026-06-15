import { StateCreator } from "zustand";
import { AxiosInstance, AxiosError } from "axios";
import toast from "react-hot-toast";
import socket from "@/lib/socket";
import { Ticket, TicketState, TicketActions, ApiResponse } from "./ticketTypes";
import { CreateTicketPayload } from "./ticketTypes";
import { useAuthStore } from "../auth/useAuthStore";

type TicketStore = TicketState & TicketActions;

export const createTicketActions =
  (axiosInstance: AxiosInstance): StateCreator<
    TicketStore,
    [],
    [],
    TicketActions
  > =>
  (set, _get) => ({
    fetchAllTickets: async () => {
      set({ loading: true, error: undefined });

      try {
        const res = await axiosInstance.get<ApiResponse<Ticket[]>>("/tickets"); // admin endpoint
        console.log("Fetched all tickets:", res.data.data);
        set({ tickets: res.data.data });
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to fetch all tickets" });
      } finally {
        set({ loading: false });
      }
    },

    // Inside your store actions (createTicketActions or similar)
    fetchTicketById: async (ticketId) => {
      set({ loading: true }); // Or a separate 'fetchingSelected' loading state
      try {
        const res = await axiosInstance.get(`/tickets/${ticketId}`);
        const updatedTicket = res.data.data; // This is the mapped DTO

        set((state) => ({
          // 1. Update the specific ticket in the list so the table stays in sync
          tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
          // 2. Set the official "Selected" ticket
          selectedTicket: updatedTicket,
          loading: false,
        }));
        
        return updatedTicket;
      } catch (err) {
        set({ error: "Failed to load ticket details", loading: false });
      }
    },

    fetchMyTickets: async () => {
      set({ loading: true, error: undefined });

      try {
        const res = await axiosInstance.get<ApiResponse<Ticket[]>>("/tickets/my"); // user-specific endpoint
        console.log("Fetched my tickets:", res.data.data);
        set({ tickets: res.data.data });
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to fetch my tickets" });
      } finally {
        set({ loading: false });
      }
    },

    // initSocket: () => {
    //   if (socket.connected) return;

    //   // 1. Clean up old listeners first to avoid memory leaks/double-firing
    //   socket.off("connect");
    //   socket.off("userTyping");
    //   socket.off("userStoppedTyping");
    //   socket.off("ticketUpdated");
    //   socket.off("connect_error");

    //   // 2. Define the Auth Recovery (The "Net")
    //   socket.on("connect_error", async (err) => {
    //     if (err.message === "Unauthorized") {
    //       console.warn("Socket connection failed: Token expired. Triggering refresh...");
    //       try {
    //         await axiosInstance.get('/auth/fetch'); 
    //         socket.connect(); 
    //       } catch (refreshErr) {
    //         console.error("Socket recovery failed.");
    //         useAuthStore.getState().logout('auto');
    //       }
    //     }
    //   });

    //   // 3. Define successful connection logic
    //   socket.on("connect", () => {
    //     const currentTicket = _get().selectedTicket;
    //     if (currentTicket?.id) {
    //       socket.emit("joinTicket", currentTicket.id);
    //     }
    //   });

    //   // 4. Define data listeners
    //   socket.on("userTyping", ({ username }) => {
    //     set({ isTyping: true, typingUser: username });
    //   });

    //   socket.on("userStoppedTyping", () => {
    //     set({ isTyping: false, typingUser: null });
    //   });

    //   socket.on("ticketUpdated", (updatedTicket: Ticket) => {
    //     set({ isTyping: false, typingUser: null });

    //     set((state) => {
    //       const ticketId = updatedTicket.id;
    //       const isCurrentlyOpen = state.selectedTicket?.id === ticketId;
    //       const lastMessage = updatedTicket.messages?.length > 0 
    //         ? updatedTicket.messages[updatedTicket.messages.length - 1] 
    //         : null;
          
    //       const senderId = lastMessage?.senderId;
    //       const myId = useAuthStore.getState().authUser?.id;

    //       const isUnread = !isCurrentlyOpen && 
    //                       !state.unreadTicketIds.includes(ticketId) && 
    //                       senderId !== myId;

    //       return {
    //         tickets: state.tickets.map((t) => (t.id === ticketId ? updatedTicket : t)),
    //         selectedTicket: isCurrentlyOpen ? updatedTicket : state.selectedTicket,
    //         unreadTicketIds: isUnread ? [...state.unreadTicketIds, ticketId] : state.unreadTicketIds,
    //       };
    //     });
    //   });

    //   // 5. FINALLY, trigger the connection
    //   socket.connect(); 
    // },

    initSocket: () => {
      if (socket.connected) return;

      // 1. Clean up old listeners
      socket.off("connect");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("ticketUpdated");
      socket.off("connect_error");

      // 2. Auth Recovery (Keep your existing logic here)
      socket.on("connect_error", async (err) => {
        if (err.message === "Unauthorized") {
          console.warn("Socket connection failed: Token expired. Triggering refresh...");
          try {
             const connectionSuccessful = await axiosInstance.get('/auth/fetch'); 
            // If we get here, it means the refresh worked!
            if (connectionSuccessful) {
              console.log("Refresh successful, reconnecting socket...");
            }else{
              console.log("Refresh unsuccessful, disconnecting socket...");
            }

            socket.connect(); 
          } catch (refreshErr) {
            console.error("Socket recovery failed.");
            useAuthStore.getState().logout('auto');
          }
        }
      });

      // 3. Connection logic
      socket.on("connect", () => {
        const currentTicket = _get().selectedTicket;
        if (currentTicket?.id) socket.emit("joinTicket", currentTicket.id);
      });

      // 4. Typing Indicators
      socket.on("userTyping", ({ username }) => set({ isTyping: true, typingUser: username }));
      socket.on("userStoppedTyping", () => set({ isTyping: false, typingUser: null }));

      // 5. THE REAL-TIME NOTIFICATION BRAIN
      socket.on("ticketUpdated", (updatedTicket: Ticket) => {
        set({ isTyping: false, typingUser: null });

        const myUser = useAuthStore.getState().authUser;
        const myRole = myUser?.role; // 'admin' or 'customer'

        set((state) => {
          const ticketId = updatedTicket.id;
          const isCurrentlyOpen = state.selectedTicket?.id === ticketId;

          // CALCULATION: Use the dual-clock timestamps we added to the DTO
          const lastRead = myRole === 'admin' 
            ? new Date(updatedTicket.adminLastReadAt).getTime()
            : new Date(updatedTicket.customerLastReadAt).getTime();
            
          // const updatedAt = new Date(updatedTicket.updatedAt).getTime();

          // LOGIC: It's unread if:
          // 1. We aren't currently looking at it
          // 2. AND the last person to speak was NOT us
          // 3. AND the updatedAt is newer than our specific read clock
          const lastMessage = updatedTicket.messages?.[updatedTicket.messages.length - 1];
          const lastReadTime = lastRead ? new Date(lastRead).getTime() : 0;
          const updatedTime = new Date(updatedTicket.updatedAt).getTime();
          const isUnread = !isCurrentlyOpen && 
                 lastMessage?.senderId !== myUser?.id && 
                 updatedTime > (lastReadTime + 1000);

          // We attach the calculated 'isUnread' boolean directly to the ticket object
          const processedTicket = { ...updatedTicket, isUnread };

          return {
            tickets: state.tickets.map((t) => (t.id === ticketId ? processedTicket : t)),
            selectedTicket: isCurrentlyOpen ? processedTicket : state.selectedTicket,
            // No more unreadTicketIds array!
          };
        });
      });

      socket.connect(); 
    },

    
    

    // Inside useTicketStore.ts
    markAsRead: async (ticketId: string) => {
      try {
        // 1. Tell the backend to update lastReadAt
        const res = await axiosInstance.patch(`/tickets/${ticketId}/read`);
        const updatedTicket = res.data.data; // This is the DTO with isUnread: false

        // 2. Update the local state so the "New" badge disappears instantly
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? updatedTicket : t
          ),
        }));
      } catch (err) {
        console.error("Failed to mark ticket as read", err);
      }
    },

    updateTicket: (updatedTicket: Ticket) => {
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket:
          state.selectedTicket?.id === updatedTicket.id
            ? updatedTicket
            : state.selectedTicket,
      }));
    },





    createTicket: async (payload: CreateTicketPayload) => {
      set({ loading: true, error: undefined });

      try {
        // We send just the payload (subject, category, priority, message)
        // The backend reads the user session and handles creating the full Ticket object
        const res = await axiosInstance.post<{ success: boolean; data: Ticket }>("/tickets", payload);

        const newTicket = res.data.data;

        set((state) => ({
          tickets: [newTicket, ...state.tickets], // Pro-tip: putting newTicket first shows it at the top of lists instantly!
        }));

        return newTicket; 
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to create ticket" });
        throw err; 
      } finally {
        set({ loading: false });
      }
    },

    selectTicket: (ticket: Ticket | null) => {
      set({ selectedTicket: ticket });
    },

    sendReply: async (ticketId, content) => {
      set({ sendingMessage: true, error: undefined });

      try {
        const res = await axiosInstance.post(
          `/tickets/${ticketId}/reply`,
          { content }
        );

        // 🛡️ FIX: Extract the nested ticket object
        const updatedTicket = res.data.data;

        // ✅ call updateTicket from the store itself
        _get().updateTicket(updatedTicket);

        toast.success("Reply sent!");
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to send reply" });
        toast.error(error.message || "Failed to send reply");
      } finally {
        set({ sendingMessage: false });
      }
    },

    

    assignTicket: async (ticketId: string) => {
      try {
        const res = await axiosInstance.post<ApiResponse<Ticket>>(`/tickets/${ticketId}/assign`);
        const updatedTicket = res.data.data;

        _get().updateTicket(updatedTicket);

        toast.success("Ticket assigned to you!");
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to assign ticket" });
        toast.error(error.message || "Failed to assign ticket");
      }
    },

    escalateTicket: async (ticketId) => {
      try {
        const res = await axiosInstance.post<ApiResponse<Ticket>>(`/tickets/${ticketId}/escalate`);
        const updatedTicket = res.data.data;

        _get().updateTicket(updatedTicket);

        toast.success("Ticket escalated!");
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to escalate ticket" });
        toast.error(error.message || "Failed to escalate ticket");
      }
    },

    resolveTicket: async (ticketId) => {
      try {
        const res = await axiosInstance.post<ApiResponse<Ticket>>(`/tickets/${ticketId}/resolve`);
        const updatedTicket = res.data.data;

        _get().updateTicket(updatedTicket);

        toast.success("Ticket resolved!");
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to resolve ticket" });
        toast.error(error.message || "Failed to resolve ticket");
      }
    },

    closeTicket: async (ticketId: string) => {
      try {
        const res = await axiosInstance.post<ApiResponse<Ticket>>(`/tickets/${ticketId}/close`);
        const updatedTicket = res.data.data;

        _get().updateTicket(updatedTicket);

        toast.success("Ticket closed!");
      } catch (err) {
        const error = err as AxiosError;
        set({ error: error.message || "Failed to close ticket" });
        toast.error(error.message || "Failed to close ticket");
      }
    },

  });
