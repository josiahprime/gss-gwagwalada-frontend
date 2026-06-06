import React, { useState } from "react";
import BugReportModal from "./BugReportModal";
import { useBugReportStore } from "store/bugReport/useBugReportStore";


const severityColors = {
  Low: "bg-green-50 border-green-200 text-green-700",
  Medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
  High: "bg-orange-50 border-orange-200 text-orange-700",
  Critical: "bg-red-50 border-red-200 text-red-700",
} as const;

const statusColors = {
  UNRESOLVED: "bg-gray-50 border-gray-200 text-gray-700",
  IN_PROGRESS: "bg-blue-50 border-blue-200 text-blue-700",
  RESOLVED: "bg-green-50 border-green-200 text-green-700",
} as const;


const formatStatus = (s: string): Status => {
  switch (s.toUpperCase().replace(" ", "_")) {
    case "IN_PROGRESS":
      return "IN_PROGRESS";
    case "UNRESOLVED":
      return "UNRESOLVED";
    case "RESOLVED":
      return "RESOLVED";
    default:
      return s as Status; // fallback
  }
};



type Severity = keyof typeof severityColors;
type Status = "UNRESOLVED" | "IN_PROGRESS" | "RESOLVED";



export interface Bug {
  id: number;
  title: string;
  description: string;
  steps: string;
  severity: Severity;
  contact: string | null;
  fileUrl?: string | null;
  filePublicId?: string | null;
  status: Status;
  createdAt: string;
}


interface BugReportTableProps {
  bugs: Bug[];
  setBugs: React.Dispatch<React.SetStateAction<Bug[]>>;
}







const BugReportTable: React.FC<BugReportTableProps> = ({ bugs, setBugs }) => {
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const setBugStatus = useBugReportStore((state)=>state.setBugStatus)

  const getSeverityColor = (severity: Severity) => severityColors[severity];
  const getStatusColor = (status: Status) => statusColors[status];

  

  const handleUpdateStatus = async (bugId: Bug["id"], newStatus: Status) => {
    const bug = bugs.find(b => b.id === bugId);
    if (!bug) return; // ensures "status" always exists

    const previousStatus = bug.status;

    setBugs(prev =>
      prev.map(b => (b.id === bugId ? { ...b, status: newStatus } : b))
    );

    try {
      await setBugStatus(bugId, newStatus);
    } catch (err) {
      // rollback with guaranteed non-undefined status
      setBugs(prev =>
        prev.map(b => (b.id === bugId ? { ...b, status: previousStatus } : b))
      );
      console.error("Failed to update status", err);
    }
  };






  const renderRow = (bug: Bug) => {
    const colorKey = formatStatus(bug.status);
    const displayStatus = colorKey.replace("_", " "); // shows friendly label


    return (
      <tr key={bug.id} className="border-b border-gray-200 hover:bg-gray-50">
        <td className="p-4 font-medium text-gray-900">{bug.title}</td>
        <td className="p-4">
          <span
              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(bug.severity)}`}
            >
              {bug.severity}
            </span>
        </td>
        <td className="p-4">
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(colorKey as Status)}`}
          >
            {displayStatus}
          </span>
        </td>
        <td className="p-4 text-gray-500">{new Date(bug.createdAt).toLocaleDateString()}</td>
        <td className="p-4 text-gray-500">{bug.contact || "N/A"}</td>
        <td className="p-4">
          {bug.fileUrl ? (
            <a
              href={bug.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View
            </a>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </td>
        <td className="p-4 text-right flex gap-2 justify-end">
          <button
            onClick={() => setSelectedBug(bug)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700"
          >
            View
          </button>
        </td>
      </tr>
    );
  };


  return (
    <section className="rounded-xl shadow bg-white">
      <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold tracking-tight text-gray-900">All Bug Reports</h2>
      </div>
      <div className="p-2 md:p-6">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="p-4 text-left text-gray-500">Title</th>
                <th className="p-4 text-left text-gray-500">Severity</th>
                <th className="p-4 text-left text-gray-500">Status</th>
                <th className="p-4 text-left text-gray-500">Submitted</th>
                <th className="p-4 text-left text-gray-500">Reporter</th>
                <th className="p-4 text-left text-gray-500">Attachment</th>
                <th className="p-4 text-right text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map(renderRow)}
              {bugs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No bug reports yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing bug */}
      {selectedBug && (
        <BugReportModal
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </section>
  );
};

export default BugReportTable;
