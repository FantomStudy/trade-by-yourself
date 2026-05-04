import type { Appeal } from "@/types";

import { apiGet, apiPost, apiPut } from "./api";

export const createAppeal = (productId: number, reason: string) =>
  apiPost("/moderation/appeals", { productId, reason });

export const getMyAppeals = () => apiGet<Appeal[]>("/moderation/appeals/my");

export const getAllAppeals = () => apiGet<Appeal[]>("/admin/moderation/appeals");

export const reviewAppeal = (id: number, status: "APPROVED" | "REJECTED", comment?: string) =>
  apiPut(`/admin/moderation/appeals/${id}/review`, { status, comment });
