import type { PayDealResponse } from "@/types";

import { api } from "@/api/instance";

export const payDeal = async (id: number) =>
  api<PayDealResponse>(`/deals/${id}/pay`, {
    method: "POST",
  });
