// store/dashboard/types.ts

export interface DashboardStats {
  userCount: number;
  orderCount: number;
  completedOrderCount: number;
  totalRevenue: number;
  todayRevenue: number;
}

export interface FeaturedStats {
  todayRevenue: number;
  lastWeek: number;
  lastMonth: number;
  target: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string; // e.g. "2025-12"
  revenue: number;
}

export interface DashboardState {
  stats: DashboardStats | null;
  featured: FeaturedStats | null;
  loading: boolean;
  error: string | null;

  // 👇 ADD NEW STATE FOR FEATURED
  loadingFeatured: boolean;
  errorFeatured: string | null;

  // Monthly revenue
  monthlyRevenue: MonthlyRevenue[];
  loadingRevenue: boolean;
  errorRevenue: string | null;
}

export interface DashboardActions {
  fetchStats: () => Promise<void>;
  fetchMonthlyRevenue: () => Promise<void>;
  fetchFeatured: () => Promise<void>;
}
