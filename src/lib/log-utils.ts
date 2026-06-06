export type LogLevel = "info" | "warning" | "error";

export interface SystemLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  userId?: string;
  referenceId?: string;
  requestId: string;
  metadata?: Record<string, unknown>;
  stackTrace?: string;
}

export function getLogLevelColor(level: LogLevel): string {
  switch (level) {
    case "info":
      return "log-level-info";
    case "warning":
      return "log-level-warning";
    case "error":
      return "log-level-error";
    default:
      return "log-level-info";
  }
}

export function getLogLevelBgColor(level: LogLevel): string {
  switch (level) {
    case "info":
      return "bg-blue-50";
    case "warning":
      return "bg-amber-50";
    case "error":
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export function formatTimestampShort(date: Date): string {
  if (isToday(date)) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return formatDate(date);
}

export function filterLogs(
  logs: SystemLog[],
  filters: {
    level?: LogLevel;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  },
): SystemLog[] {
  return logs.filter((log) => {
    if (filters.level && log.level !== filters.level) {
      return false;
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesUserId = log.userId?.toLowerCase().includes(query);
      const matchesRefId = log.referenceId?.toLowerCase().includes(query);
      const matchesMessage = log.message.toLowerCase().includes(query);
      if (!matchesUserId && !matchesRefId && !matchesMessage) {
        return false;
      }
    }

    if (filters.startDate && log.timestamp < filters.startDate) {
      return false;
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (log.timestamp > endOfDay) {
        return false;
      }
    }

    return true;
  });
}
