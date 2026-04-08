import { api } from "@/api/instance";

export const checkIsAdmin = () => api<{ isAdmin: boolean }>("/auth/isAdmin");
