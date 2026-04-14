export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: "INDIVIDUAL" | "IP" | "OOO";
  photo: string;
}

export interface CurrentUser extends User {
  rating: number | null;
  isAnswersCall: boolean;
  role: string;
}

export interface UserDetailed {
  id: number;
  fullName: string;
  profileType: string;
  phoneNumber: string;
  balance: number;
  bonusBalance: number;
  photo: string | null;
  usedFreeAds: number;
  rating: number;
  reviewsCount: number;
  adsLimit: {
    total: number;
    used: number;
    remaining: number;
    costPerAd: number;
  };
}
