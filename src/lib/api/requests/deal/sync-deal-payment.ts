import type { Deal } from "@/types";

import { api } from "@/api/instance";

/** Опрос Тинькофф и перевод сделки в PAID, если webhook не дошёл (localhost). */
export const syncDealPayment = async (id: number) =>
  api<{ deal: Deal }>(`/deals/${id}/sync-payment`, {
    method: "POST",
  });
