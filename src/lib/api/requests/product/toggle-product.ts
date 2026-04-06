import { api } from "../../instance";

export const toggleProduct = async (productId: number) =>
  api(`/product/toggle-product/${productId}`, {
    method: "PUT",
  });
