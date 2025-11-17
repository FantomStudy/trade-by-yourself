export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: "INDIVIDUAL" | "OOO";
}

export interface CurrentUser {
  id: number;
  fullName: string;
  phoneNumber: string;
  profileType: "INDIVIDUAL" | "OOO";
  rating: number | null;
  reviewsCount: number;
}
