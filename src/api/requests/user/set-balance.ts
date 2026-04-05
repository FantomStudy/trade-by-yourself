import { api } from "@/api/instance";

export const setUserBalance = async (userId: number, balance: number) =>
  api(`/user/set-balance/${userId}?balance=${balance}`, { method: "PUT" });
