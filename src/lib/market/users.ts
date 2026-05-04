import { apiPut } from "./api";

export const setUserRole = (
  userId: number,
  role: "USER" | "USER_VERIFIED" | "SENIOR_MODERATOR" | "ADMIN" | "SUPERADMIN",
) => apiPut(`/user/${userId}/role`, { role });
