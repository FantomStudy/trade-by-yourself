import type { AdminDealLog } from "@/types";

import { api } from "@/api/instance";

export const getAdminDealLogs = async (dealId: number) =>
  api<AdminDealLog[]>(`/admin/deals/${dealId}/logs`);

