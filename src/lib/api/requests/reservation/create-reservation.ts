import type { CreateReservationRequest, Reservation } from "@/types";

import { api } from "@/api/instance";

export const createReservation = async (body: CreateReservationRequest) =>
  api<Reservation>("/reservations", {
    method: "POST",
    body: JSON.stringify({
      productId: body.productId,
      ...(body.note?.trim() ? { note: body.note.trim() } : {}),
    }),
  });
