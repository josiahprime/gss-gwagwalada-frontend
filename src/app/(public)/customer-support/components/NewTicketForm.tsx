import { useState } from "react";
import type { Ticket, TicketCategory, TicketPriority, CreateTicketPayload } from "store/ticket/ticketTypes";
import { FormField } from "./FormField";
import { CategorySelect } from "./CategorySelect";
import PrioritySelect from "./PrioritySelect";
import { SubmitButton } from "./SubmitButton";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface NewTicketFormProps {
  onCreateTicket: (payload: CreateTicketPayload) => Promise<void>;
}


export function NewTicketForm({ onCreateTicket }: NewTicketFormProps) {
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<TicketCategory>("general");
  const [priority, setPriority] = useState<TicketPriority>("low");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    onCreateTicket({
      subject,
      category,
      priority,
      message, // 👈 important
    })
      .finally(() => {
        setLoading(false);
        setSubject("");
        setMessage("");
        setCategory("general");
        setPriority("low");
        setIsExpanded(false);
      });
  }


  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 mb-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-medium text-gray-800">
            Open a new support ticket
          </span>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">
              Open a New Ticket
            </h2>

            <FormField
              label="Subject"
              placeholder="Brief summary of your issue"
              value={subject}
              onChange={setSubject}
            />

            <CategorySelect value={category} onChange={setCategory} />
            <PrioritySelect value={priority} onChange={setPriority} />

            <FormField
              label="Message"
              textarea
              placeholder="Describe your issue in detail"
              value={message}
              onChange={setMessage}
            />

            <SubmitButton loading={loading} />
          </form>
        </div>
      )}
    </div>
  );
}
