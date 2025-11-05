import { api } from "../../instance";

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  profileType: string;
}

export interface RegisterResponse {
  message: string;
}

export const register = async (data: RegisterRequest) => {
  const response = await api.post<RegisterResponse>("/auth/sign-up", data);

  return response.data;
};
