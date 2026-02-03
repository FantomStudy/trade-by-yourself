import type {
  ModerateReviewData,
  ModerateReviewResponse,
  ReviewToModerate,
} from "../types";
import { api } from "../instance";

export interface SendReviewDto {
  text: string;
  rating: number;
  reviewedUserId: number;
}

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

export const getReviews = async () => api<Review[]>("/review/all-reviews");

export const getUserReviews = async (userId: number) =>
  api<Review[]>(`/review/user-reviews/${userId}`);

export const sendReview = async (data: SendReviewDto) =>
  api<Review>("/review/send-review", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Получить список отзывов на модерации (для админа)
export const getAllReviewsToModerate = async () =>
  api<ReviewToModerate[]>("/review/all-reviews-to-moderate");

// Модерировать отзыв (одобрить/отклонить)
export const moderateReview = async ({
  reviewId,
  status,
}: ModerateReviewData) =>
  api<ModerateReviewResponse>(`/review/moderate-review/${reviewId}`, {
    method: "PUT",
    query: { status },
  });
