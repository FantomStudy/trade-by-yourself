import { api } from "../instance";

export interface AnalyticsData {
  views?: number;
  phone?: number;
}

export interface GetAnalyticsParams {
  period?: string;
  categoryId?: number;
}

export const getAnalytics = ({ period, categoryId }: GetAnalyticsParams = {}) => {
  const query = new URLSearchParams();

  if (period) {
    query.set("period", period);
  }

  if (typeof categoryId === "number") {
    query.set("categoryId", String(categoryId));
  }

  const qs = query.toString();
  const endpoint = qs ? `/statistics/analytic?${qs}` : "/statistics/analytic";

  return api<AnalyticsData>(endpoint);
};
