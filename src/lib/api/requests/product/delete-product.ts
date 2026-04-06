import { api } from "@/api/instance";

export const deleteProduct = async (productId: number) => {
  const response = await api(`/product/${productId}`, {
    method: "DELETE",
  });

  return response;
};
