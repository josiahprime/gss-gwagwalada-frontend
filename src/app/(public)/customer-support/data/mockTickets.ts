import type { Ticket } from "store/ticket/ticketTypes";


// export const mockTickets: Ticket[] = [
//   {
//     id: "TCK-1001",
//     subject: "Delayed delivery of maize seeds",
//     category: "delivery",
//     priority: "high",
//     status: "open",
//     createdAt: new Date("2026-01-12T10:30:00Z"),
//     updatedAt: new Date("2026-01-13T08:15:00Z"),
//     customerId: "CUST-1",
//     customerName: "John Ade",
//     customerEmail: "john@example.com",
//     messages: [
//       {
//         id: "MSG-1",
//         sender: "customer",
//         senderName: "John Ade",
//         content: "My delivery was supposed to arrive last week but I haven’t received anything.",
//         timestamp: new Date("2026-01-12T10:30:00Z"),
//       },
//     ],
//   },
// ];

export interface Message {
  id: string;
  sender: 'customer' | 'support';
  content: string;
  timestamp: string;
}


// export interface Ticket {
//   id: string;
//   subject: string;
//   category: string;
//   priority: 'low' | 'medium' | 'urgent';
//   status: 'open' | 'pending' | 'resolved';
//   createdAt: string;
//   updatedAt: string;
//   messages: Message[];
// }

export const categories = [
  { value: 'order', label: 'Order Issues' },
  { value: 'payment', label: 'Payment Problems' },
  { value: 'delivery', label: 'Delivery Questions' },
  { value: 'quality', label: 'Product Quality' },
  { value: 'refund', label: 'Refunds & Returns' },
  { value: 'account', label: 'Account Help' }
];
