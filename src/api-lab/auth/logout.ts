import { api } from "../instance";

export interface LogoutResponse {
  message: string;
}

export const logout = () => {
  return api<LogoutResponse>("/auth/logout", { method: "POST" });
};
