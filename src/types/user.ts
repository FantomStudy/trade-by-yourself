export interface User {
  id: number;
  email?: string;
  fullName: string;
  phoneNumber: string;
  profileType: string;
  rating: number | null;
  photo: string | null;
  balance: number;
  bonusBalance?: number;
  products?: number;
  isBanned?: boolean;
  usedFreeAds?: number;
  reviewsCount?: number;
  adsLimit?: {
    total: number;
    used: number;
    remaining: number;
    costPerAd: number;
  };
}

export interface CurrentUser {
  id: number;
  fullName: string;
  phoneNumber: string;
  profileType: string;
  rating: number;
  reviewsCount: number;
  balance: number;
  photo: string | null;
}
