import type { CreateDealRequest, Deal } from "@/types";

import { api } from "@/api/instance";

export const createDeal = async (body: CreateDealRequest) =>
  api<Deal>("/deals", {
    method: "POST",
    body: JSON.stringify(body),
  });
