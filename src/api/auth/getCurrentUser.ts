import type { CurrentUser } from "../users";
import { api } from "../instance";

export const getCurrentUser = () => api<CurrentUser>("/auth/me");
