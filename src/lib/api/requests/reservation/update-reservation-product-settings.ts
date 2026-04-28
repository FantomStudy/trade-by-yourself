import type { UpdateReservationProductSettingsRequest } from "@/types";

import { api } from "@/api/instance";

export const updateReservationProductSettings = async (
  body: UpdateReservationProductSettingsRequest,
) =>
  api<{ success: boolean }>("/reservations/product-settings", {
    method: "PUT",
    body: JSON.stringify(body),
  });
