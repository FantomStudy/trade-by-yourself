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
  const response = await api.get<AnalyticsResponse>("/statistics/analytic", {
    query: {
      ...query,
    },
  });

  return response.data;
};
