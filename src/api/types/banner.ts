import type { BannerPlace } from "@/types/banner";

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
