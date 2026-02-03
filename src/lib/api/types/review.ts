import { z } from "zod";

// Статус отзыва
export type ReviewStatus = "PENDING" | "APPROVED" | "DENIDED";

// Автор и получатель отзыва
export interface ReviewUser {
  id: number;
  fullName: string;
}

// Отзыв на модерации
export interface ReviewToModerate {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  reviewedBy: ReviewUser; // Кто оставил отзыв
  reviewedUser: ReviewUser; // Кому оставлен отзыв
}

// Схема для модерации отзыва
export const moderateReviewSchema = z.object({
  reviewId: z.number().positive("ID отзыва обязателен"),
  status: z.enum(["APPROVED", "DENIDED"], {
    required_error: "Статус обязателен",
  }),
});

export type ModerateReviewData = z.infer<typeof moderateReviewSchema>;

// Ответ после модерации
export interface ModerateReviewResponse {
  message: string;
}
