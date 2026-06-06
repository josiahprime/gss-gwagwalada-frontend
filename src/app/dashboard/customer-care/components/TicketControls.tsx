import { SearchInput } from './SearchInput';
import { FilterButton } from './FilterButton';
import { TicketStatus, TicketPriority, TicketCategory } from 'store/ticket/ticketTypes';


interface FilterState {
  status: TicketStatus[];
  priority: TicketPriority[];
  category: TicketCategory[];
}

interface TicketControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function TicketControls({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: TicketControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Search input */}
      <div className="flex-1">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by ticket ID or customer name..."
        />
      </div>

      {/* Filters */}
      <div>
        <FilterButton filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </div>
  );
}
