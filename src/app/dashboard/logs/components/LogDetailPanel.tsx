import { X } from "lucide-react";
import { SystemLog, formatTimestamp, getLogLevelColor } from "lib/log-utils";

interface LogDetailPanelProps {
  log: SystemLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDetailPanel({
  log,
  isOpen,
  onClose,
}: LogDetailPanelProps) {
  if (!isOpen || !log) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Log Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Timestamp & Level */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Timestamp
            </label>
            <p className="text-sm text-gray-900">{formatTimestamp(log.timestamp)}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Log Level
            </label>
            <span className={`log-level-badge ${getLogLevelColor(log.level)}`}>
              {log.level.toUpperCase()}
            </span>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Message
            </label>
            <p className="text-sm text-gray-700 leading-relaxed">{log.message}</p>
          </div>

          {/* Request ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Request ID
            </label>
            <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded overflow-x-auto">
              {log.requestId}
            </p>
          </div>

          {/* User ID */}
          {log.userId && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                User ID
              </label>
              <p className="text-sm text-gray-900">{log.userId}</p>
            </div>
          )}

          {/* Reference ID */}
          {log.referenceId && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Reference ID
              </label>
              <p className="text-sm text-gray-900">{log.referenceId}</p>
            </div>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Metadata
              </label>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto text-gray-700">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Stack Trace */}
          {log.stackTrace && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Stack Trace
              </label>
              <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto text-gray-700">
                {log.stackTrace}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
