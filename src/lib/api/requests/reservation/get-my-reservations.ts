import type { Reservation } from "@/types";

import { api } from "@/api/instance";

export const getMyReservations = async () => api<Reservation[]>("/reservations/my");
