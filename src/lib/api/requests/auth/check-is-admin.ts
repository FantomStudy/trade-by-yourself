import { api } from "@/api/instance";

export const checkIsAdmin = async () =>
  api<{ isAdmin: boolean }>("/auth/isAdmin");
