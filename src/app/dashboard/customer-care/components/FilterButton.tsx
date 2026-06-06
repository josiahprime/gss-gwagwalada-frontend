import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { TicketStatus, TicketPriority, TicketCategory } from 'store/ticket/ticketTypes';

interface FilterState {
  status: TicketStatus[];
  priority: TicketPriority[];
  category: TicketCategory[];
}

interface FilterButtonProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const categoryOptions: { value: TicketCategory; label: string }[] = [
  { value: 'order-issue', label: 'Order Issue' },
  { value: 'payment', label: 'Payment' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'product-quality', label: 'Product Quality' },
  { value: 'account', label: 'Account' },
  { value: 'refund', label: 'Refund' },
  { value: 'general', label: 'General' },
];

export function FilterButton({ filters, onFiltersChange }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeFiltersCount =
    filters.status.length + filters.priority.length + filters.category.length;

  const toggleFilter = <T extends TicketStatus | TicketPriority | TicketCategory>(
    key: keyof FilterState,
    value: T
  ) => {
    const currentValues = filters[key] as T[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [key]: newValues,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderOptions = (
    options: { value: any; label: string }[],
    key: keyof FilterState
  ) =>
    options.map((option) => {
      const isActive = filters[key].includes(option.value);
      return (
        <button
          key={option.value}
          onClick={() => toggleFilter(key, option.value)}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition"
        >
          <span
            className={`flex h-4 w-4 items-center justify-center rounded border ${
              isActive
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300'
            }`}
          >
            {isActive && <Check className="h-3 w-3" />}
          </span>
          {option.label}
        </button>
      );
    });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 transition"
      >
        <Filter className="h-4 w-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs bg-green-600 text-white">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Status</div>
            {renderOptions(statusOptions, 'status')}

            <div className="my-1 border-t border-gray-200" />

            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Priority</div>
            {renderOptions(priorityOptions, 'priority')}

            <div className="my-1 border-t border-gray-200" />

            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Category</div>
            {renderOptions(categoryOptions, 'category')}
          </div>
        </div>
      )}
    </div>
  );
}
