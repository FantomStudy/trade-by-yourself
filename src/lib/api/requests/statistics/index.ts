import { api } from "../../instance";

export interface SearchQueryStatItem {
  query: string;
  searches: number;
  avgResults: number;
  lastSearched: string;
}

export interface SearchQueriesResponse {
  days: number;
  hasAccess: boolean;
  isLocked: boolean;
  totalCount: number;
  items: SearchQueryStatItem[];
  lockMessage?: string;
}

export interface DailyDynamicItem {
  date: string;
  createdCount: number;
  promotedCount: number;
}

export interface CabinetDashboardResponse {
  days: number;
  adsTypes: {
    total: number;
    vip: number;
    top: number;
    free: number;
    moderation: number;
    hidden: number;
    drafts: number;
    expired: number;
    avgPaidViews: number;
    avgFreeViews: number;
    dailyDynamics: DailyDynamicItem[];
  };
  tariffFunnel?: {
    tariff_view: number;
    tariff_select: number;
    payment: number;
    publication: number;
  };
  revenueBreakdown?: Array<{
    promotionType: string;
    category: string;
    revenue: number;
  }>;
}

export interface UserAnalyticsResponse {
  period?: string;
  totalViews?: number;
  totalPhoneViews?: number;
  totalFavorites?: number;
  views?: number;
  phone?: number;
  favorites?: number;
}

export const getUserAnalytics = async (params: { period: string; categoryId?: number }): Promise<UserAnalyticsResponse> => {
  const q = new URLSearchParams();
  q.append("period", params.period);
  if (params.categoryId) q.append("categoryId", String(params.categoryId));
  return api<UserAnalyticsResponse>(`/statistics/analytic?${q.toString()}`);
};

export const getSearchQueriesStats = async (days = 30): Promise<SearchQueriesResponse> => {
  return api<SearchQueriesResponse>(`/statistics/search-queries?days=${days}`);
};

export const getCabinetDashboard = async (days = 30): Promise<CabinetDashboardResponse> => {
  return api<CabinetDashboardResponse>(`/statistics/cabinet-dashboard?days=${days}`);
};
