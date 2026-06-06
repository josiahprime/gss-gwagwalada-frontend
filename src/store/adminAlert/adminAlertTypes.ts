export interface AdminAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  entityId?: string | null;
  seen: boolean;
  read: boolean;
  createdAt: string;
}

export interface AdminAlertStore {
  alerts: AdminAlert[];
  loading: boolean;
  error: string | null;
}

export interface AdminAlertActions {
  fetchAdminAlerts: () => Promise<void>;
  markAlertRead: (id: string) => void;
  markAllRead: () => void;
  markAlertSeen: (id: string) => void;
}
