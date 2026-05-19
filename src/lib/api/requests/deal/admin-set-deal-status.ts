import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const adminSetDealStatus = async (dealId: number, status: string) =>
  api<Deal>(`/admin/deals/${dealId}/status`, {
    method: "PATCH",
    body: { status },
  });

