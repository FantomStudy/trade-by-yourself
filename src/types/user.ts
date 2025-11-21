export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: string;
}

export interface CurrentUser extends Omit<User, "email"> {
  rating: number;
  reviewsCount: number;
}
