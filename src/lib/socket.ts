// src/socket.js
import { io, Socket } from 'socket.io-client';
import type { Ticket } from '@/store/ticket/ticketTypes';


// const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
//   withCredentials: true, // if you're using cookies/sessions
//   autoConnect: false,
// });

// export default socket;

// src/socket.ts


// optional: define types for events if you want
interface ServerToClientEvents {
  "ticket:message": (data: { ticketId: string; updatedTicket: any }) => void;
  "notification:new": (notification: any) => void;
  ticketUpdated: (updatedTicket: Ticket) => void;

  // 👈 ADD THESE TWO LINES HERE
  userTyping: (data: { username: string }) => void;
  userStoppedTyping: () => void;

  
}

interface ClientToServerEvents {
  join: (userId: string) => void;
  joinTicket: (ticketId: string) => void;
  leaveTicket: (ticketId: string) => void;

  typing: (data: { ticketId: string; username: string }) => void;
  stopTyping: (data: { ticketId: string }) => void;
}

// typed socket
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
  {
    withCredentials: true,
    autoConnect: false,

    // 💡 Add these two lines
    transports: ['websocket'], 
    upgrade: false,
  }
);

export default socket;

