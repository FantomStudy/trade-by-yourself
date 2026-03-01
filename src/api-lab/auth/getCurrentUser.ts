import { api } from "../instance";

export interface CurrentUser {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: string;
  photo: string;
  rating: number | null;
  isAnswersCall: boolean;
  role: string;
}

export const getCurrentUser = async () => {
  return api<CurrentUser>("/auth/me");
};
