import { api } from "@/api/instance";

export type AdminRole = "USER" | "USER_VERIFIED" | "SENIOR_MODERATOR" | "ADMIN" | "SUPERADMIN";

export const setUserRole = async (id: number, role: AdminRole) =>
  api(`/user/${id}/role`, {
    method: "PUT",
    body: { role },
  });
