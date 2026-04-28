import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const payDeal = async (id: number) =>
  api<Deal>(`/deals/${id}/pay`, {
    method: "POST",
  });
