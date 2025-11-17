import { api } from "../instance";

// FIXME: ADD TYPES
export const getReviews = async () => api<unknown[]>("/review/all-reviews");

export const sendReview = async (data: unknown) =>
  api<unknown>("/review/send-review", {
    method: "POST",
    body: data as BodyInit,
  });
