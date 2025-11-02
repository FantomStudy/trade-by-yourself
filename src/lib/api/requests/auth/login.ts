import { api } from "../../instance";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    profileType: string;
  };
}

export const login = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/sign-in", data);
  return response.data;
};
