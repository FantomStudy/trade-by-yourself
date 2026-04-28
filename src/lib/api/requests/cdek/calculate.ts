import type { CdekCalculateRequest, CdekCalculateResponse } from "@/types";

import { api } from "@/api/instance";

export const calculateCdekDelivery = async (body: CdekCalculateRequest) =>
  api<CdekCalculateResponse>("/cdek/calculate", {
    method: "POST",
    body: JSON.stringify(body),
  });
