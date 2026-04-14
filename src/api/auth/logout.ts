import { api } from "../instance";

interface LogoutResponse {
  message: string;
}

export const logout = () => {
  return api<LogoutResponse>("/auth/logout", { method: "POST" });
};
