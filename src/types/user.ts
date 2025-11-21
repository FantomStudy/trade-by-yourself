export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: string;
}

export interface CurrentUser {
  id: number;
  fullName: string;
  phoneNumber: string;
  profileType: string;
  rating: number;
  reviewsCount: number;
}
