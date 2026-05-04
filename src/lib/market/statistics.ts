import { apiGet } from "./api";

export const getCabinetDashboard = (days = 30) =>
  apiGet<{
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
  }>(`/statistics/cabinet-dashboard?days=${days}`);

export const getSearchQueries = (days = 30) =>
  apiGet<{
    days: number;
    items: { query: string; searches: number; avgResults: number; lastSearched: string }[];
  }>(`/statistics/search-queries?days=${days}`);
