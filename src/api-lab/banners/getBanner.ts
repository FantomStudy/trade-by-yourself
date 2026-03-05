import { api } from "@/api/instance";

export type BannerPlace = "PRODUCT_FEED" | "PROFILE" | "FAVORITES" | "CHATS";

export interface Banner {
  id: number;
  photoUrl: string;
  place: BannerPlace;
  name: string;
  navigateToUrl: string;
  // userId: number;
  createdAt: string;
  updatedAt: string;
}

export const getBanner = async (place: BannerPlace) =>
  api<Banner[]>("/banner", { query: { place } });
