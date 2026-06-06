'use client'

import React, { useState, useEffect } from "react";
import BugReportTable from "./components/BugReportTable";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { useThemeStore } from "store/theme/themeStore";
import { useBugReportStore } from "store/bugReport/useBugReportStore";
import { Bug as BugIcon, Info } from "lucide-react"; // rename the icon to BugIcon
import { Bug } from "./components/BugReportTable";


type UIFilters = {
  severity: "" | "Low" | "Medium" | "High" | "Critical";
  status: "" | "Unresolved" | "In Progress" | "Resolved";
};



const BugReportDashboard = () => {
  const theme = useThemeStore((s) => s.theme);
  const fetchBugReports = useBugReportStore((state)=>state.fetchBugs)
  const bugReports = useBugReportStore((state)=>state.bugReports)
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>([]);


  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UIFilters>({
    severity: "",
    status: "",
  });


  console.log('bug reports',bugReports)
  
  const hasFetched = React.useRef(false);

 useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchBugReports();
  }, [fetchBugReports]);



  // useEffect(() => {
  //   setBugs(bugReports);
  // }, [bugReports]);
  // BugReportDashboard.tsx

useEffect(() => {
  // Normalize severity for all bugReports to match Bug type
  const normalizedBugs: Bug[] = bugReports.map(b => ({
    ...b,
    severity: (b.severity.charAt(0).toUpperCase() + b.severity.slice(1).toLowerCase()) as
      | "Low"
      | "Medium"
      | "High"
      | "Critical",
  }));

  setBugs(normalizedBugs);
}, [bugReports]);



  // Mapping backend status -> UI-friendly
const mapStatusToUI = (status: Bug["status"]): UIFilters["status"] => {
  switch (status) {
    case "UNRESOLVED":
      return "Unresolved";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Resolved";
  }
};

// Filtering effect
useEffect(() => {
  let result = [...bugs];

  if (filters.severity) {
    result = result.filter(b => b.severity === filters.severity);
  }

  if (filters.status) {
    result = result.filter(b => mapStatusToUI(b.status) === filters.status);
  }

  if (searchQuery) {
    result = result.filter(b =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  setFilteredBugs(result);
}, [bugs, filters, searchQuery]);


  return (
    <div
      className={`shadow-md p-4 m-4 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      
      {/* Header */}
      <DashboardHeader
        title="Bug Report Dashboard"
        description="Review, filter, and manage bug reports submitted by users. Track severity, status, and attachments efficiently."
        badgeText="Bug Reporting"
        BadgeIcon={BugIcon}
        infoLabel="View Reports"
        InfoIcon={Info}
        theme={theme}
      />

      {/* Controls: Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>


      

      {/* Bug Reports Table */}
      <BugReportTable bugs={filteredBugs} setBugs={setBugs} />


    </div>
  );
};

export default BugReportDashboard;
