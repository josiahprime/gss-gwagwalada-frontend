"use client";

import { useEffect, useMemo, useState } from "react";
import { LogLevel, filterLogs } from "lib/log-utils";
import { FileText, Activity } from "lucide-react";
import { FilterBar } from "./components/FilterBar";
import { LogsTable } from "./components/LogsTable";
import { LogDetailPanel } from "./components/LogDetailPanel";
import { useLogStore } from "store/log/useLogStore";
import { useThemeStore } from "store/theme/themeStore";
import { Log } from "store/log/logTypes";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";


export default function Logs() {
  const {
    logs,
    loading,
    fetchInitialLogs,
    fetchMoreLogs,
    hasMore,
  } = useLogStore();

  const theme = useThemeStore((s) => s.theme);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filters, setFilters] = useState<{
    level?: LogLevel;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }>({});

  // Fetch logs on first render
  useEffect(() => {
    fetchInitialLogs();
  }, [fetchInitialLogs]);

  // Apply frontend filters to backend data
  const filteredLogs = useMemo(() => {
    return filterLogs(logs, filters);
  }, [logs, filters]);

  const handleViewDetails = (log: Log) => {
    setSelectedLog(log);
    setIsPanelOpen(true);
  };

  const handleClosePanelDetails = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  return (
    <div
      className={`shadow-md p-4 m-4 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <DashboardHeader
          title="System Logs"
          description="Monitor and analyze application events and system activities"
          badgeText="Logs"
          BadgeIcon={FileText}
          infoLabel="View Logs"
          InfoIcon={Activity}
          theme={theme}
        />

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar onFilterChange={setFilters} />
        </div>

        {/* Logs Table */}
        <LogsTable
          logs={filteredLogs}
          onViewDetails={handleViewDetails}
          loading={loading}
        />

        {/* Load more (temporary button version) */}
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={fetchMoreLogs}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}

        {/* Log Details Panel */}
        <LogDetailPanel
          log={selectedLog}
          isOpen={isPanelOpen}
          onClose={handleClosePanelDetails}
        />
      </div>
    </div>
  );
}
