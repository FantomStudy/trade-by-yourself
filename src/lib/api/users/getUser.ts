import type { UserDetailed } from "./types";
import { api } from "@/api/instance";

export const getUser = (id: number) => api<UserDetailed>(`/user/info/${id}`);
