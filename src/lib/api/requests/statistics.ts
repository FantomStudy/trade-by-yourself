import { api } from "../instance";

//FIXME: ADD TYPES
export const getAnalytic = async () => api.get<unknown>("/statistics/analytic");
