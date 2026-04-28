import type { Reservation } from "@/types";

import { api } from "@/api/instance";

export const cancelReservationByBuyer = async (id: number) =>
  api<Reservation>(`/reservations/${id}/cancel-by-buyer`, {
    method: "POST",
  });
