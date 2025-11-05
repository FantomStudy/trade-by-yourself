import type { User } from "@/types/user.type";

import { api } from "../../instance";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/sign-in", data);
  return response.data;
};
