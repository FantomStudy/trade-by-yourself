import type { BannerStats } from "@/api/types/banner";

import { api } from "@/api/instance";

export const getMyBannerStats = async () =>
  api<BannerStats[]>("/banner/my-stats/all", {
    method: "GET",
  });

export const getBannerStats = async (bannerId: number) =>
  api<BannerStats>(`/banner/${bannerId}/stats`, {
    method: "GET",
  });
