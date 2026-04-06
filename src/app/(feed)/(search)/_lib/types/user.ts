export interface User {
  id: number;
  balance: number;
  fullName: string;
  phoneNumber: string;
  photo: string | null;
  profileType: string;
  rating: number;
  reviewsCount: number;
}
