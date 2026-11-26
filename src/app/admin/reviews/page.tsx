"use client";

import { Check, Star, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getAllReviewAppeals, resolveReviewAppeal } from "@/api/requests/reviews";
import { useModerateReviewMutation, useReviewsToModerate } from "@/api/hooks";
import { Dialog, DialogContent, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api/instance";

import { MobileHeader } from "../_components/admin-sidebar";

const APPEALS_QUERY_KEY = ["reviewAppeals"];
const ALL_REVIEWS_QUERY_KEY = ["allAdminReviews"];

type ReviewFilter = "MODERATE" | "APPROVED" | "DENIDED" | "ALL";

interface AdminAllReview {
  id: number;
  rating: number;
  text: string;
  moderateState: "MODERATE" | "APPROVED" | "DENIDED";
  createdAt: string;
  reviewer?: { id: number; fullName: string; phoneNumber?: string };
  reviewedUser?: { id: number; fullName: string; phoneNumber?: string };
}

const STATE_BADGE: Record<string, { label: string; className: string }> = {
  MODERATE: { label: "На модерации", className: "bg-amber-100 text-amber-800" },
  APPROVED: { label: "Одобрен", className: "bg-emerald-100 text-emerald-800" },
  DENIDED: { label: "Отклонён", className: "bg-red-100 text-red-800" },
};

const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ReviewFilter>("MODERATE");

  const { data: reviews, isLoading: isLoadingModerate } = useReviewsToModerate();
  const { data: allReviewsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ALL_REVIEWS_QUERY_KEY,
    queryFn: () => api<{ reviews: AdminAllReview[]; total: number }>("/review/all-reviews?limit=100"),
  });

  const { data: appeals = [] } = useQuery({
    queryKey: APPEALS_QUERY_KEY,
    queryFn: getAllReviewAppeals,
  });

  const moderateQueue = Array.isArray(reviews) ? reviews : [];
  const allReviews = Array.isArray(allReviewsData?.reviews) ? allReviewsData.reviews : [];
  const appealsList = Array.isArray(appeals) ? appeals : [];

  const moderateReviewMutation = useModerateReviewMutation();
  const resolveAppealMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "APPROVED" | "REJECTED" }) =>
      resolveReviewAppeal(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPEALS_QUERY_KEY }),
  });

  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const handleApprove = async (reviewId: number) => {
    setModeratingId(reviewId);
    try {
      await moderateReviewMutation.mutateAsync({ reviewId, status: "APPROVED" });
      await queryClient.invalidateQueries({ queryKey: ALL_REVIEWS_QUERY_KEY });
    } finally {
      setModeratingId(null);
    }
  };

  const handleRejectClick = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedReviewId) return;
    setModeratingId(selectedReviewId);
    setShowRejectDialog(false);
    try {
      await moderateReviewMutation.mutateAsync({ reviewId: selectedReviewId, status: "DENIDED" });
      await queryClient.invalidateQueries({ queryKey: ALL_REVIEWS_QUERY_KEY });
    } finally {
      setModeratingId(null);
      setSelectedReviewId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="h-4 w-4"
          fill={star <= rating ? "#fbbf24" : "none"}
          stroke={star <= rating ? "#fbbf24" : "#d1d5db"}
        />
      ))}
    </div>
  );

  const openAppeals = appealsList.filter((a) => a.status === "OPEN");

  const displayedReviews: AdminAllReview[] =
    filter === "MODERATE"
      ? moderateQueue.map((r) => ({
          id: r.id,
          rating: r.rating,
          text: r.text,
          moderateState: "MODERATE",
          createdAt: r.createdAt,
          reviewer: r.reviewedBy,
          reviewedUser: r.reviewedUser,
        }))
      : filter === "ALL"
        ? allReviews
        : allReviews.filter((r) => r.moderateState === filter);

  const isLoading = filter === "MODERATE" ? isLoadingModerate : isLoadingAll;

  return (
    <>
      <MobileHeader title="Модерация отзывов" />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <Typography className="text-2xl font-bold">Модерация отзывов</Typography>
          <Typography className="text-gray-500">
            На модерации: {moderateQueue.length} · Всего: {allReviewsData?.total ?? allReviews.length}
          </Typography>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-lg border bg-white p-1 shadow-sm w-fit">
          {(
            [
              { value: "MODERATE", label: `На модерации (${moderateQueue.length})` },
              { value: "APPROVED", label: "Одобренные (в т.ч. ИИ)" },
              { value: "DENIDED", label: "Отклонённые (в т.ч. ИИ)" },
              { value: "ALL", label: "Все отзывы" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === tab.value ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
            <Typography>Загрузка...</Typography>
          </div>
        ) : displayedReviews.length === 0 ? (
          <div style={{ padding: "24px", backgroundColor: "white", borderRadius: "12px" }}>
            <Typography className="text-gray-500">Нет отзывов по выбранному фильтру</Typography>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {displayedReviews.map((review) => {
              const badge = STATE_BADGE[review.moderateState] || STATE_BADGE.MODERATE;
              return (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <Typography className="mb-1 text-sm text-gray-500">Автор</Typography>
                      <Typography className="font-semibold">{review.reviewer?.fullName || "—"}</Typography>
                    </div>
                    <div>
                      <Typography className="mb-1 text-sm text-gray-500">Получатель</Typography>
                      <Typography className="font-semibold">{review.reviewedUser?.fullName || "—"}</Typography>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mb-1 flex items-center justify-end gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                          {badge.label}
                        </span>
                        <Typography className="text-xs text-gray-400">{formatDate(review.createdAt)}</Typography>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                    <Typography className="text-sm leading-relaxed">{review.text || "(без текста)"}</Typography>
                  </div>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    {review.moderateState !== "DENIDED" && (
                      <Button disabled={moderatingId === review.id} onClick={() => handleRejectClick(review.id)}>
                        <X className="h-4 w-4" /> Отклонить
                      </Button>
                    )}
                    {review.moderateState !== "APPROVED" && (
                      <Button disabled={moderatingId === review.id} onClick={() => handleApprove(review.id)}>
                        <Check className="h-4 w-4" /> Одобрить
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography className="text-2xl font-bold">Апелляции по отзывам</Typography>
          <Typography className="text-gray-500">Открытые: {openAppeals.length}</Typography>
        </div>

        {openAppeals.length === 0 ? (
          <div style={{ padding: "24px", backgroundColor: "white", borderRadius: "12px" }}>
            <Typography className="text-gray-500">Нет открытых апелляций</Typography>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {openAppeals.map((appeal) => (
              <div key={appeal.id} style={{ backgroundColor: "white", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <Typography className="text-sm text-gray-500">Апелляция #{appeal.id} · отзыв #{appeal.reviewId}</Typography>
                <Typography>{appeal.reason}</Typography>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <Button
                    disabled={resolveAppealMutation.isPending}
                    onClick={() => resolveAppealMutation.mutate({ id: appeal.id, status: "REJECTED" })}
                  >
                    Отклонить
                  </Button>
                  <Button
                    disabled={resolveAppealMutation.isPending}
                    onClick={() => resolveAppealMutation.mutate({ id: appeal.id, status: "APPROVED" })}
                  >
                    Одобрить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog onOpenChange={setShowRejectDialog} open={showRejectDialog}>
        <DialogContent className="max-w-md p-6">
          <div className="flex flex-col gap-4">
            <Typography className="text-lg font-semibold">Подтверждение отклонения</Typography>
            <Typography className="text-gray-600">Вы уверены, что хотите отклонить этот отзыв?</Typography>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Отмена</Button>
              <Button onClick={handleRejectConfirm}>Отклонить</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewsPage;
