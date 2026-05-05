import type { CdekTariffItem, CdekTariffsRequest } from "@/types";

import { api } from "@/api/instance";

export const getCdekTariffs = async (body: CdekTariffsRequest) =>
  api<CdekTariffItem[]>("/cdek/tariffs", {
    method: "POST",
    body: JSON.stringify(body),
  });
