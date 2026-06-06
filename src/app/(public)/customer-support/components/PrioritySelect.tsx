import type { TicketPriority } from "store/ticket/ticketTypes";

interface PrioritySelectProps {
  value: TicketPriority;
  onChange: (value: TicketPriority) => void;
}


const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => {

  const priorities: {
    value: TicketPriority;
    label: string;
    description: string;
  }[] = [
    { value: 'low', label: 'Low', description: 'General questions, not time-sensitive' },
    { value: 'medium', label: 'Medium', description: 'Needs attention within a few days' },
    { value: 'high', label: 'Urgent', description: 'Requires immediate assistance' }
  ];


  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        How urgent is this?
      </label>
      <div className="space-y-2">
        {priorities.map((priority) => (
          <label
            key={priority.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              value === priority.value
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="priority"
              value={priority.value}
              checked={value === priority.value}
              onChange={(e) => onChange(e.target.value as TicketPriority)}
            />

            <div>
              <p className="font-medium text-gray-800">{priority.label}</p>
              <p className="text-sm text-gray-500">{priority.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelect;

