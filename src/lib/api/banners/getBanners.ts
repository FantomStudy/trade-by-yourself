import type { Banner, BannerPlace } from "./types";
import { api } from "../instance";

export const getBanners = (query?: { place: BannerPlace }) => api<Banner[]>("/banner", { query });
