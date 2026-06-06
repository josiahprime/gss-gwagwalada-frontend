export type TicketPriority = 'high' | 'medium' | 'low';
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketCategory = 
  | 'order-issue' 
  | 'payment' 
  | 'delivery' 
  | 'product-quality' 
  | 'account' 
  | 'refund' 
  | 'general';

export interface Message {
  id: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    role: 'customer' | 'admin';
  };
  senderName: string;
  content: string;
  createdAt: Date;
}


export interface CreateTicketPayload {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  message: string;
}


export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  isUnread: boolean;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  

  // 👇 CHANGE THESE: Match your new Prisma schema
  adminLastReadAt: Date | string;
  customerLastReadAt: Date | string;

  
  assignedTo?: string | null;
}

export interface SupportStats {
  openTickets: number;
  pendingReplies: number;
  resolvedTickets: number;
  avgResponseTime: string;
}


/** State for the ticket store */
export interface TicketState {
  tickets: Ticket[];
  // unreadTicketIds: string[],
  loading: boolean;
  selectedTicket: Ticket | null;
  error?: string;

  sendingMessage: boolean;
  assigningTicket: boolean;
  escalatingTicket: boolean;
  resolvingTicket: boolean;

  // 👈 ADD THESE FOR THE TYPING UI
  isTyping: boolean;
  typingUser: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}



/** Actions for the ticket store */
export interface TicketActions {
  /** Fetch all tickets from backend */
  fetchAllTickets: () => Promise<void>;

  /** Fetch tickets by id from backend */
  fetchTicketById: (ticketId: string) => Promise<void>;

  /** Fetch users tickets from backend */
  fetchMyTickets: () => Promise<void>;

  /** Select a ticket for viewing in the drawer */
  selectTicket: (ticket: Ticket | null) => void;

  /** Send a reply to a ticket */
  sendReply: (ticketId: string, content: string) => Promise<void>;

  // listen for messages and transmit it to frontend instantly
  initSocket: () => void;

  /** Assign a ticket to an admin */
  assignTicket: (ticketId: string) => Promise<void>;

  /** Escalate a ticket to high priority */
  escalateTicket: (ticketId: string) => Promise<void>;

  /** Resolve a ticket */
  resolveTicket: (ticketId: string) => Promise<void>;

   createTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => Promise<Ticket>;

   updateTicket: (updatedTicket: Ticket) => void;

  /** Mark a ticket as read to remove the notification dot */
  markAsRead: (ticketId: string) => void;

   /** Close a ticket */
  closeTicket: (ticketId: string) => Promise<void>;

}