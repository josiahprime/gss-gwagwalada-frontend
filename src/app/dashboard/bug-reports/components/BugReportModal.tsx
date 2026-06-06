import React, {useState} from "react";
import Image from "next/image";

const severityColors = {
  Low: "bg-green-50 border-green-200 text-green-700",
  Medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
  High: "bg-orange-50 border-orange-200 text-orange-700",
  Critical: "bg-red-50 border-red-200 text-red-700",
} as const;

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

 type StatusUI = keyof typeof STATUS_API_MAP; // "In_Progress" | "Unresolved" | "Resolved"

// Format status string for UI display
const formatStatus = (s: string): "In_Progress" | "Unresolved" | "Resolved" | string => {
  switch (s.toUpperCase().replace(" ", "_")) {
    case "IN_PROGRESS":
      return "In_Progress";
    case "UNRESOLVED":
      return "Unresolved";
    case "RESOLVED":
      return "Resolved";
    default:
      return s;
  }
};

// Map UI <-> API
const STATUS_API_MAP: Record<"Unresolved" | "In_Progress" | "Resolved", Status> = {
  Unresolved: "UNRESOLVED",
  In_Progress: "IN_PROGRESS",
  Resolved: "RESOLVED",
};

// const STATUS_UI_MAP: Record<Status, string> = {
//   UNRESOLVED: "Unresolved",
//   IN_PROGRESS: "In Progress",
//   RESOLVED: "Resolved",
// };

// Props for BugReportModal
interface BugReportModalProps {
  bug: Bug;
  onClose: () => void;
  onUpdateStatus: (bugId: Bug["id"], newStatus: Status) => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({ bug, onClose, onUpdateStatus }) => {
  // Normalize incoming DB values
  const normalizedSeverity =
    bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1).toLowerCase();

  const normalizedStatus = formatStatus(bug.status);
 

  const [status, setStatus] = useState<StatusUI>(normalizedStatus as StatusUI);
  const [pendingStatus, setPendingStatus] = useState<StatusUI>(normalizedStatus as StatusUI);


  const statusOptions = ["Unresolved", "In_Progress", "Resolved"];

 

  const handleApplyChanges = () => {
    setStatus(pendingStatus); // update UI immediately
    const backendStatus = STATUS_API_MAP[pendingStatus]; // convert to backend format
    onUpdateStatus(bug.id, backendStatus);
  };

  const getSeverityColor = (severity: Severity) => severityColors[severity];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <div
        className="
          relative w-11/12 md:w-2/3 lg:w-1/2 
          max-h-[90vh] overflow-y-auto 
          p-6 rounded-xl bg-white shadow-xl 
          border border-gray-200 text-gray-800 no-scrollbar
        "
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{bug.title}</h2>
        <p className="mb-4 text-gray-600">{bug.description}</p>

        {/* Severity */}
        <div className="mb-3">
          <strong className="text-gray-700">Severity:</strong>{" "}
          <span
            className={`
              inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border
              ${getSeverityColor(normalizedSeverity as Severity)}
            `}
          >
            {normalizedSeverity}
          </span>

        </div>

        {/* Status Select */}
        <div className="mb-3">
          <strong className="text-gray-700">Status:</strong>{" "}
          <select
            value={pendingStatus}
            onChange={(e) => setPendingStatus(e.target.value as StatusUI)}
            className="ml-2 px-3 py-1 rounded-md text-sm bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}  {/* user-friendly */}
              </option>
            ))}
          </select>

          {pendingStatus !== status && (
            <button
              onClick={handleApplyChanges}
              className="
                ml-3 px-3 py-1 rounded-md text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700 transition
              "
            >
              Apply Changes
            </button>
          )}
        </div>


        <p className="mb-2">
          <strong className="text-gray-700">Submitted:</strong>{" "}
          {new Date(bug.createdAt).toLocaleString()}
        </p>

        <p className="mb-4">
          <strong className="text-gray-700">Reporter:</strong>{" "}
          {bug.contact || "N/A"}
        </p>

        {bug.fileUrl && (
          <div className="mb-4">
            <strong className="text-gray-700">Attachment:</strong>
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative w-full h-60">
              <Image
                src={bug.fileUrl}
                alt="Attachment"
                fill
                style={{ objectFit: "contain" }}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md font-medium
              bg-gray-100 text-gray-700
              border border-gray-300
              hover:bg-gray-200 transition
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugReportModal;
