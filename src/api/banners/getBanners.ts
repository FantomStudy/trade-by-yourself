import type { Banner, BannerPlace } from "@/types/banner";
import { api } from "../instance";

export const getBanners = (query?: { place: BannerPlace }) => api<Banner[]>("/banner", { query });
