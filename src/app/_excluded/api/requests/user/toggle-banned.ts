import { api } from "@/api/instance";

export const toggleUserBanned = async (id: number) =>
  api(`/user/toggle-banned/${id}`, {
    method: "PUT",
  });
