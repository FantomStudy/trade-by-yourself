import { api } from "../../instance";

export interface AdminAnalyticsData {
  days: number;
  totalProducts: number;
  activeProducts: number;
  paidProducts: number;
  freeProducts: number;
  moderationCount: number;
  draftsCount: number;
  hiddenCount: number;
  deniedCount: number;
  totalUsers: number;
  individualUsersCount: number;
  legalUsersCount: number;
  bannedUsersCount: number;
  emailVerifiedCount: number;
  phoneVerifiedCount: number;
  newUsersCount: number;
  newProductsCount: number;
  totalDeals: number;
  totalRevenue: number;
  periodRevenue: number;
  topRegions: Array<{ region: string; count: number }>;
  topCategories: Array<{ id: number; name: string; count: number }>;
  dailyDynamics: Array<{
    date: string;
    usersCount: number;
    productsCount: number;
    revenue: number;
  }>;
}

export const getAdminAnalytics = async (days = 30): Promise<AdminAnalyticsData> =>
  api<AdminAnalyticsData>(`/statistics/admin-dashboard?days=${days}`, { cache: "no-store" });
