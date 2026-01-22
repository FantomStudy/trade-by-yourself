export type BannerPlace = "product_feed" | "profile" | "chats" | "favorites";
export type BannerPlaceAPI = "PRODUCT_FEED" | "PROFILE" | "CHATS" | "FAVORITES";

export interface Banner {
  id: number;
  photoUrl: string;
  place: BannerPlaceAPI;
  name: string;
  navigateToUrl: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerData {
  image: File;
  place: BannerPlace;
  name: string;
  navigateToUrl: string;
}

export interface UpdateBannerData {
  image?: File;
  place?: BannerPlace;
  name?: string;
  navigateToUrl?: string;
}

export interface GetBannersParams {
  place?: BannerPlace;
}
