import type { CurrentUser } from "@/types";

import { api } from "@/api/instance";

export const getCurrentUser = async () => api<CurrentUser>("/user/info");
