import { api } from "@/api/instance";

export interface AnalyticQueryParams {
  period?: "day" | "week" | "month" | "quarter" | "half-year" | "year";
  categoryId?: number;
  region?: string;
  productId?: number;
}

function buildAnalyticQuery(params?: AnalyticQueryParams) {
  if (!params) return "";
  const query = new URLSearchParams();
  if (params.period) query.set("period", params.period);
  if (params.categoryId !== undefined) query.set("categoryId", String(params.categoryId));
  if (params.region) query.set("region", params.region);
  if (params.productId !== undefined) query.set("productId", String(params.productId));
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export const getAnalytic = async (params?: AnalyticQueryParams) =>
  api<unknown>(`/statistics/analytic${buildAnalyticQuery(params)}`);

export interface ProductsAnalyticItem {
  [key: string]: string | number | boolean | null;
}

export const getProductsAnalytic = async () => api<ProductsAnalyticItem[]>("/statistics/products-analytic");

export interface SearchQueryInsight {
  query: string;
  searches: number;
  avgResults: number;
  lastSearched: string;
}

export interface SearchQueriesResponse {
  days: number;
  items: SearchQueryInsight[];
}

export const getSearchQueries = async (days = 30) =>
  api<SearchQueriesResponse>(`/statistics/search-queries?days=${days}`);

export interface CabinetDashboardResponse {
  days: number;
  adsTypes: { free: number; paid: number; total: number };
  tariffFunnel: {
    tariff_view: number;
    tariff_select: number;
    payment: number;
    publication: number;
  };
  revenueBreakdown: { promotionType: string; category: string; revenue: number }[];
  tariffClickHeatmap: {
    view_to_select: number;
    select_to_pay: number;
    pay_to_publish: number;
  };
}

export const getCabinetDashboard = async (days = 30) =>
  api<CabinetDashboardResponse>(`/statistics/cabinet-dashboard?days=${days}`);
