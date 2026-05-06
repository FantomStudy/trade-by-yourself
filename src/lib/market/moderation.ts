import { apiGet } from "./api";

export const getModerationQueue = (filter = "", page = 1) =>
  apiGet<{ items?: Array<{ id: number; name: string; moderateState: string }> }>(
    `/admin/moderation/products?filter=${encodeURIComponent(filter)}&page=${page}`,
  );

export const getModerationProduct = (id: number) => apiGet(`/admin/moderation/products/${id}`);

export const getModerationSummary = (days = 30) => apiGet(`/admin/moderation/summary?days=${days}`);

export const getModerationAuditLogs = (limit = 100) =>
  apiGet(`/admin/moderation/audit-logs?limit=${limit}`);
