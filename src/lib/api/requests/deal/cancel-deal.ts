import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const cancelDeal = async (id: number) =>
  api<Deal>(`/deals/${id}/cancel`, {
    method: "POST",
  });
