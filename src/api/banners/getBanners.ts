import { api } from "../instance";

export type BannerPlace = "PRODUCT_FEED" | "PROFILE" | "FAVORITES" | "CHATS";

export interface Banner {
  id: number;
  photoUrl: string;
  place: BannerPlace;
  name: string;
  navigateToUrl: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export const getBanners = (query?: { place: BannerPlace }) => api<Banner[]>("/banner", { query });
