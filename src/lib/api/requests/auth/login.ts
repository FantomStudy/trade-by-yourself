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
  console.log("Logging in with data:", data);
  const response = await api.post<LoginResponse>("/auth/sign-in", data);
  console.log("Login successful, cookies after login:", document.cookie);
  return response.data;
};
