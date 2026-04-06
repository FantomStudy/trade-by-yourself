import { api } from "@/api/instance";

// FIXME: ADD TYPES
export const getAnalytic = async () => api<unknown>("/statistics/analytic");
