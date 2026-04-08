import { api } from "../instance";

export const deleteProduct = (productId: number) =>
  api(`/product/${productId}`, { method: "DELETE" });
