export type BannerPlace = "PRODUCT_FEED" | "PROFILE" | "FAVORITES" | "CHATS";

export interface Banner {
  id: number;
  name: string;
  photoUrl: string;
  place: BannerPlace;
  navigateToUrl: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerContent {
  image: File;
  place: BannerPlace;
  name: string;
  navigateToUrl: string;
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
