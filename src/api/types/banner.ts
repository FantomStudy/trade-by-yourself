export type BannerPlace = "PRODUCT_FEED" | "PROFILE" | "CHATS" | "FAVORITES";

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

export interface BannerStats {
  bannerId: number;
  bannerName: string;
  place: BannerPlace;
  totalViews: number;
  uniqueViews: number;
  viewsByDate: Array<{
    date: string;
    views: number;
  }>;
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
