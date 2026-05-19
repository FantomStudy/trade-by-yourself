import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const getAdminDeals = async () => api<Deal[]>("/admin/deals/list");

