import type { BannerStats } from "./types";
import { api } from "../instance";

export const getBannerStats = (bannerId: number) => api<BannerStats>(`/banner/${bannerId}/stats`);

export const getProfileBannerStats = () => api<BannerStats[]>("/banner/my-stats/all");
