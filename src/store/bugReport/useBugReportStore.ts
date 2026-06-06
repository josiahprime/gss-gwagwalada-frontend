import { create } from "zustand";
import { BugReportState, BugReportActions } from "./bugReportTypes";
import { createBugReportActions } from "./createBugReportActions";

type BugReportStore = BugReportState & BugReportActions;

export const useBugReportStore = create<BugReportStore>((set, get) => ({
  // initial state
  title: "",
  description: "",
  steps: "",
  severity: "",
  contact: "",
  file: null,
  loading: false,
  bugReports: [],
  // actions
  ...createBugReportActions(set, get),
}));
