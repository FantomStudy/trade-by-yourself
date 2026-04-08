"use client";

import { Check, Star, X } from "lucide-react";
import { useState } from "react";
import { useModerateReviewMutation, useReviewsToModerate } from "@/api/hooks";
import { Dialog } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { MobileHeader } from "../_components/admin-sidebar";

const ReviewsPage = () => {
  const { data: reviews, isLoading } = useReviewsToModerate();
  const moderateReviewMutation = useModerateReviewMutation();
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const handleApprove = async (reviewId: number) => {
    setModeratingId(reviewId);
    try {
      await moderateReviewMutation.mutateAsync({
        reviewId,
        status: "APPROVED",
      });
    } catch (error) {
      console.error("Error approving review:", error);
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
      await moderateReviewMutation.mutateAsync({
        reviewId: selectedReviewId,
        status: "DENIDED",
      });
    } catch (error) {
      console.error("Error rejecting review:", error);
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

  const renderStars = (rating: number) => {
    return (
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
  };

  if (isLoading) {
    return (
      <>
        <MobileHeader title="Модерация отзывов" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
          }}
        >
          <Typography>Загрузка...</Typography>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Модерация отзывов" />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography className="text-2xl font-bold">Модерация отзывов</Typography>
          <Typography className="text-gray-500">Всего: {reviews?.length || 0}</Typography>
        </div>

        {!reviews || reviews.length === 0 ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography className="text-gray-500">Нет отзывов на модерации</Typography>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <Typography className="mb-1 text-sm text-gray-500">Автор отзыва</Typography>
                    <Typography className="font-semibold">{review.reviewedBy.fullName}</Typography>
                    <Typography className="text-xs text-gray-400">
                      ID: {review.reviewedBy.id}
                    </Typography>
                  </div>

                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <Typography className="mb-1 text-sm text-gray-500">
                      Получатель отзыва
                    </Typography>
                    <Typography className="font-semibold">
                      {review.reviewedUser.fullName}
                    </Typography>
                    <Typography className="text-xs text-gray-400">
                      ID: {review.reviewedUser.id}
                    </Typography>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <Typography className="mb-1 text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </Typography>
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <Typography className="text-sm leading-relaxed">{review.text}</Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                    paddingTop: "8px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: moderatingId === review.id ? "not-allowed" : "pointer",
                      opacity: moderatingId === review.id ? 0.5 : 1,
                    }}
                    disabled={moderatingId === review.id}
                    onClick={() => handleRejectClick(review.id)}
                  >
                    <X className="h-4 w-4" />
                    Отклонить
                  </Button>

                  <Button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: moderatingId === review.id ? "not-allowed" : "pointer",
                      opacity: moderatingId === review.id ? 0.5 : 1,
                    }}
                    disabled={moderatingId === review.id}
                    onClick={() => handleApprove(review.id)}
                  >
                    <Check className="h-4 w-4" />
                    Одобрить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog onOpenChange={setShowRejectDialog} open={showRejectDialog}>
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Typography className="text-lg font-semibold">Подтверждение отклонения</Typography>
          <Typography className="text-gray-600">
            Вы уверены, что хотите отклонить этот отзыв?
          </Typography>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#e5e7eb",
                color: "#374151",
              }}
              onClick={() => setShowRejectDialog(false)}
            >
              Отмена
            </Button>
            <Button
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#ef4444",
                color: "white",
              }}
              onClick={handleRejectConfirm}
            >
              Отклонить
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReviewsPage;
