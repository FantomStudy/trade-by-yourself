import { api } from "../../instance";

export interface AnalyticsQueryParams {
  categoryId?: number;
  period?: string;
  productId?: number;
  region?: string;
}

export interface AnalyticsResponse {
  totalFavorites: number;
  totalPhoneViews: number;
  totalViews: number;
}

export const getAnalitics = async (query: AnalyticsQueryParams) => {
  return api
    .get<AnalyticsResponse>("/statistics/analytic", { query: { ...query } })
    .then((r) => r.data);
};
