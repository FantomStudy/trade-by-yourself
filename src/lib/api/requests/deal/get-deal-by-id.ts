import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const getDealById = async (id: number) => api<Deal>(`/deals/${id}`);
