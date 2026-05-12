import type { DealCdekQrResponse } from "@/types";

import { api } from "@/api/instance";

/** Живой QR и трек из CDEK по сохранённому orderUuid сделки (участник сделки). */
export const getDealCdekQr = async (dealId: number) =>
  api<DealCdekQrResponse>(`/deals/${dealId}/cdek-qr`);
