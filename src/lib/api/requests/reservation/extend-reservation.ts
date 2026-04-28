import type { Reservation } from "@/types";

import { api } from "@/api/instance";

export const extendReservation = async (id: number) =>
  api<Reservation>(`/reservations/${id}/extend`, {
    method: "POST",
  });
