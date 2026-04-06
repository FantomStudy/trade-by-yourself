import { api } from "@/api/instance";

export const deleteUser = async (id: number) =>
  api(`/user/${id}`, {
    method: "DELETE",
  });
