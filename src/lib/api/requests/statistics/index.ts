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

export interface CabinetDashboardResponse {
  days: number;
  adsTypes: {
    free: number;
    paid: number;
    total: number;
  };
  tariffFunnel: {
    tariff_view: number;
    tariff_select: number;
    payment: number;
    publication: number;
  };
  revenueBreakdown: Array<{
    promotionType: string;
    category: string;
    revenue: number;
  }>;
}

export const getSearchQueriesStats = async (days = 30): Promise<SearchQueriesResponse> => {
  return api<SearchQueriesResponse>(`/statistics/search-queries?days=${days}`);
};

export const getCabinetDashboard = async (days = 30): Promise<CabinetDashboardResponse> => {
  return api<CabinetDashboardResponse>(`/statistics/cabinet-dashboard?days=${days}`);
};
