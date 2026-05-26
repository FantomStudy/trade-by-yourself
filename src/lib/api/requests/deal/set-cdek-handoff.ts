import type { Deal } from "@/types";

import { api } from "@/api/instance";

export type SetCdekHandoffRequest = {
  mode: "pvz" | "courier";
  cdekFromPvzCode?: string;
  cdekFromAddress?: string;
};

export const setCdekHandoff = async (dealId: number, body: SetCdekHandoffRequest) =>
  api<Deal>(`/deals/${dealId}/cdek-handoff`, {
    method: "POST",
    body: JSON.stringify(body),
  });
