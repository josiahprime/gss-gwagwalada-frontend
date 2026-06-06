import React from "react";
import SimpleSelect from "./SimpleSelect";

type Filters = {
  severity: "Low" | "Medium" | "High" | "Critical" | "";
  status: "Unresolved" | "In Progress" | "Resolved" | "";
};

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <SimpleSelect
        label="Severity"
        options={["Low", "Medium", "High", "Critical"]}
        value={filters.severity}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, severity: value as Filters["severity"] }))
        }
      />
      <SimpleSelect
        label="Status"
        options={["Unresolved", "In Progress", "Resolved"]}
        value={filters.status}
        onChange={(value) =>
          setFilters((prev) => ({ ...prev, status: value as Filters["status"] }))
        }
      />
    </div>
  );
};

export default FilterBar;
