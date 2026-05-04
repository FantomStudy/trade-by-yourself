import type { Deal } from "@/types";

import { api } from "@/api/instance";

interface MarkShippedPayload {
  cdekOrderUuid?: string;
  cdekTrackNumber?: string;
}

export const shipDeal = async (id: number, payload: MarkShippedPayload) =>
  api<Deal>(`/deals/${id}/mark-shipped`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
