import { api } from "../instance";

//FIXME: ADD TYPES
export const getReviews = async () => api.get<unknown[]>("/review/all-reviews"); 

// export const sendReview = async (data: unknown) =>
//   api.post<unknown>("/review/send-review", data);
