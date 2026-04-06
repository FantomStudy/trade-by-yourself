import { api } from "@/api/instance";

export const deleteBanner = async (id: number) => {
  return api(`/banner/${id}`, {
    method: "DELETE",
  });
};
