export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: string;
  rating: number | null;
  photo: string | null;
  balance: number;
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
