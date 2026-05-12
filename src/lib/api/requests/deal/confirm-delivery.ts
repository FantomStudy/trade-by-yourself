import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const confirmDealDelivery = async (id: number) =>
  api<Deal>(`/deals/${id}/confirm-delivery`, {
    method: "POST",
  });
