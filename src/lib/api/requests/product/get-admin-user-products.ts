import type { Product } from "@/types";

import { api } from "../../instance";

export type AdminUserProduct = Product & {
  statusLabel?: string;
};

export const getAdminUserProducts = async (userId: number) =>
  api<AdminUserProduct[]>(`/product/admin-user-products/${userId}`, { cache: "no-store" });
