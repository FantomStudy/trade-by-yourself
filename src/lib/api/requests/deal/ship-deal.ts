import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const shipDeal = async (id: number) =>
  api<Deal>(`/deals/${id}/ship`, {
    method: "POST",
  });
