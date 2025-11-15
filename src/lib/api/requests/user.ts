import type { CurrentUser } from "@/types";

import { api } from "../instance";

export const getCurrentUser = async () => api<CurrentUser>("/user/info");
