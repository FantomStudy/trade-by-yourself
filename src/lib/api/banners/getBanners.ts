import type { Banner, BannerPlace } from "./types";
import { api } from "../instance";

export const getBanners = async (query?: { place: BannerPlace }): Promise<Banner[]> => {
  try {
    const res = await api<Banner[]>("/banner", { query });
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
};

