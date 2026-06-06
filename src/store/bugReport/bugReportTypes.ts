export type Severity = "low" | "medium" | "high" | "critical";

export type BugStatus = "UNRESOLVED" | "IN_PROGRESS"| "RESOLVED"

export interface BugReport {
  id: number;
  title: string;
  description: string;
  steps: string;
  severity: Severity;
  contact: string | null;
  fileUrl?: string | null;
  filePublicId?: string | null;
  status: BugStatus;
  createdAt: string;
}

export interface BugReportState {
  title: string;
  description: string;
  steps: string;
  severity: Severity | "";
  contact: string;
  file: File | null;
  loading: boolean;
  bugReports: BugReport[];
}

export interface BugReportActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSteps: (steps: string) => void;
  setSeverity: (severity: Severity) => void;
  setContact: (contact: string) => void;
  setFile: (file: File | null) => void;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
  setBugStatus: (id: number, status: BugStatus) => Promise<void>;
  submitBugReport: () => Promise<boolean>;
  fetchBugs: () => void;
}
