export type LogType = "AUTH" | "PURCHASE" | "SYSTEM" | "PAYMENT";
export type LogLevel = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface Log {
  id: number;
  type: LogType;
  level: LogLevel;
  message: string;
  userId?: string;
  referenceId?: string;
  source?: string;
  metadata?: any;
  createdAt: string;
}

export interface LogResponse {
  data: Log[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface LogState {
  logs: Log[];
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface LogActions {
  fetchInitialLogs: () => Promise<void>;
  fetchMoreLogs: () => Promise<void>;
  resetLogs: () => void;
}
