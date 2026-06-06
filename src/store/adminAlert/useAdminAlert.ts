import { create } from "zustand"; // named import
import { AdminAlertStore } from "./adminAlertTypes";
import { createAdminAlertActions } from "./createAdminAlertActions";

type AdminAlertState = AdminAlertStore & ReturnType<typeof createAdminAlertActions>;

export const useAdminAlertStore = create<AdminAlertState>((set, get) => ({
  alerts: [],
  loading: false,
  error: null,
  ...createAdminAlertActions(set, get), // works fine now
}));
