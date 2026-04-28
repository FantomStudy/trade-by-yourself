import type { Reservation } from "@/types";

import { api } from "@/api/instance";

export const cancelReservationBySeller = async (id: number, reason: string) =>
  api<Reservation>(`/reservations/${id}/cancel-by-seller`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
