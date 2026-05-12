import type { CdekPvz } from "@/types";

import { api } from "@/api/instance";

export const getCdekDeliveryPoints = async (cityCode: number) =>
  api<CdekPvz[]>(`/cdek/delivery-points?cityCode=${cityCode}`);
