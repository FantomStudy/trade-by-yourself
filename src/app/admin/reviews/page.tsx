"use client";

import { Check, Star, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { getAllReviewAppeals, resolveReviewAppeal } from "@/api/requests/reviews";
import { useModerateReviewMutation, useReviewsToModerate } from "@/api/hooks";
import { Dialog, Typography } from "@/components/ui";
import { Button } from "@/components/ui/Button";

import { MobileHeader } from "../_components/admin-sidebar";

const APPEALS_QUERY_KEY = ["reviewAppeals"];

const ReviewsPage = () => {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useReviewsToModerate();
  const { data: appeals = [] } = useQuery({
    queryKey: APPEALS_QUERY_KEY,
    queryFn: getAllReviewAppeals,
  });
  const reviewsList = Array.isArray(reviews) ? reviews : [];
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
    } finally {
      setModeratingId(null);
      setSelectedReviewId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Модерация отзывов" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
          <Typography>Загрузка...</Typography>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Модерация отзывов" />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography className="text-2xl font-bold">Модерация отзывов</Typography>
          <Typography className="text-gray-500">На модерации: {reviewsList.length}</Typography>
        </div>

        {reviewsList.length === 0 ? (
          <div style={{ padding: "24px", backgroundColor: "white", borderRadius: "12px" }}>
            <Typography className="text-gray-500">Нет отзывов на модерации</Typography>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviewsList.map((review) => (
              <div key={review.id} style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <Typography className="mb-1 text-sm text-gray-500">Автор</Typography>
                    <Typography className="font-semibold">{review.reviewedBy.fullName}</Typography>
                  </div>
                  <div>
                    <Typography className="mb-1 text-sm text-gray-500">Получатель</Typography>
                    <Typography className="font-semibold">{review.reviewedUser.fullName}</Typography>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Typography className="mb-1 text-xs text-gray-400">{formatDate(review.createdAt)}</Typography>
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <Typography className="text-sm leading-relaxed">{review.text || "(без текста)"}</Typography>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <Button disabled={moderatingId === review.id} onClick={() => handleRejectClick(review.id)}>
                    <X className="h-4 w-4" /> Отклонить
                  </Button>
                  <Button disabled={moderatingId === review.id} onClick={() => handleApprove(review.id)}>
                    <Check className="h-4 w-4" /> Одобрить
                  </Button>
                </div>
              </div>
            ))}
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
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Typography className="text-lg font-semibold">Подтверждение отклонения</Typography>
          <Typography className="text-gray-600">Вы уверены, что хотите отклонить этот отзыв?</Typography>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button onClick={() => setShowRejectDialog(false)}>Отмена</Button>
            <Button onClick={handleRejectConfirm}>Отклонить</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReviewsPage;
