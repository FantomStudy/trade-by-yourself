import z from "zod";
import { api } from "../instance";

export const sendReviewSchema = z.object({
  text: z.string().min(1, "Пожалуйста, напишите текст отзыва"),
  rating: z.number().min(1, "Пожалуйста, поставьте оценку").max(5),
});

export type SendReviewInput = z.infer<typeof sendReviewSchema>;

export interface Review {
  id: number;
  text: string;
  rating: number;
  createdAt: string;
  reviewer: {
    id: number;
    fullName: string;
    photo: string | null;
  };
  reviewedUser: {
    id: number;
    fullName: string;
  };
}

export interface SendReviewBody extends SendReviewInput {
  reviewedUserId: number;
}

export const sendReview = async (body: SendReviewBody) =>
  api<Review>("/review/send-review", { method: "POST", body });
