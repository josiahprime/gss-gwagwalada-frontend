import { Log } from "store/log/logTypes";
import { Eye } from "lucide-react";

interface LogsTableProps {
  logs: Log[];
  onViewDetails: (log: Log) => void;
  isLoading?: boolean;
}

type BackendLogLevel = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export function getLogLevelColor(level: BackendLogLevel | string) {
  switch (level.toLowerCase()) {
    case "info":
      return "bg-green-100 text-green-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800";
    case "error":
      return "bg-red-100 text-red-800";
    case "critical":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function formatTimestamp(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(); // or your formatting logic
}




export function LogsTable({
  logs,
  onViewDetails,
  isLoading = false,
}: LogsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border border-gray-300 border-t-gray-700"></div>
          <p className="mt-4">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p>No logs found matching your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Event / Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Reference ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {formatTimestamp(new Date(log.createdAt))}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`log-level-badge ${getLogLevelColor(log.level)}`}
                  >
                    {log.level.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="line-clamp-2">{log.message}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {log.userId ? (
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.userId}
                    </code>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {log.referenceId ? (
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.referenceId}
                    </code>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => onViewDetails(log)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
