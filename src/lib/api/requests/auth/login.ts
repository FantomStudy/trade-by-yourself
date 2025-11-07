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
  return api.post<LoginResponse>("/auth/sign-in", data).then((r) => r.data);
};
