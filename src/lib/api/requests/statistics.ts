import { api } from "../instance";

//FIXME: ADD TYPES
export const getAnalytic = async () => api<unknown>("/statistics/analytic");
