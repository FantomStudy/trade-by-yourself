import type { Deal } from "@/types";

import { api } from "@/api/instance";

export const getMyDeals = async () => api<Deal[]>("/deals/my");
