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
