import type { Reservation } from "@/types";

import { api } from "@/api/instance";

/** Единая отмена: роль определяет бэк; продавец может передать reason */
export const cancelReservation = async (id: number, payload?: { reason?: string }) =>
  api<Reservation>(`/reservations/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify(payload?.reason?.trim() ? { reason: payload.reason.trim() } : {}),
  });
