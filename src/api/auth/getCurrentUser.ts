import type { CurrentUser } from "@/types";
import { api } from "../instance";

export const getCurrentUser = () => api<CurrentUser>("/auth/me");
