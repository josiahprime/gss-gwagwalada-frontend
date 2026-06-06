import { AdminAlertStore, AdminAlertActions, AdminAlert } from "./adminAlertTypes";
import { AxiosError } from "axios";
import axiosInstance from "lib/axios";

type StoreType = AdminAlertStore & AdminAlertActions;

export const createAdminAlertActions = (
  set: (partial: Partial<StoreType>) => void,
  get: () => StoreType
): AdminAlertActions => ({
    fetchAdminAlerts: async () => {
      set({ loading: true, error: null });
      try {
        const res = await axiosInstance.get<{ data: AdminAlert[] }>("/admin-alerts");
        set({ alerts: res.data.data, loading: false });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message || error.message || "Failed to fetch alerts";
        console.error("Admin alert fetch error:", message);
        set({ error: message, loading: false });
      }
    },

    markAlertRead: async (id: string) => {
      // Optimistically update UI
      const alerts = get().alerts.map(a => (a.id === id ? { ...a, read: true } : a));
      set({ alerts });

      try {
        await axiosInstance.patch(`/admin-alerts/${id}/read`);
      } catch (err) {
        console.error("Failed to mark alert read on server", err);
        // Rollback UI change
        const alerts = get().alerts.map(a => (a.id === id ? { ...a, read: false } : a));
        set({ alerts });
      }
    },

    markAllRead: async () => {
      // Optimistically update UI
      const alerts = get().alerts.map(a => ({ ...a, read: true }));
      set({ alerts });

      try {
        await axiosInstance.patch("/admin-alerts/read-all");
      } catch (err) {
        console.error("Failed to mark all alerts read on server", err);
        // Rollback UI change
        const alerts = get().alerts.map(a => ({ ...a, read: false }));
        set({ alerts });
      }
    },

    markAlertSeen: async (id: string) => {
      // Optimistically update UI
      const alerts = get().alerts.map(a => (a.id === id ? { ...a, seen: true } : a));
      set({ alerts });

      try {
        await axiosInstance.patch(`/admin-alerts/${id}/seen`);
      } catch (err) {
        console.error("Failed to mark alert seen on server", err);
        // Rollback UI change
        const alerts = get().alerts.map(a => (a.id === id ? { ...a, seen: false } : a));
        set({ alerts });
      }
    },
  });
