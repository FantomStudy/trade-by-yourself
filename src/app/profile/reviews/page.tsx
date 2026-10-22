"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquareQuote, Star } from "lucide-react";

import { useUserInfo } from "@/api/hooks";
import { Typography } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { getUserReviews } from "@/lib/api/requests/reviews";
import { useAuth } from "@/lib/contexts";

export default function ProfileReviewsPage() {
  const { user } = useAuth();
  const { data: userInfo } = useUserInfo(user?.id);

  const { data: rawReviews, isLoading } = useQuery({
    queryKey: ["user-reviews", user?.id],
    queryFn: () => (user?.id ? getUserReviews(user.id) : Promise.resolve([])),
    enabled: Boolean(user?.id),
  });

  const reviews = Array.isArray(rawReviews)
    ? rawReviews
    : ((rawReviews as any)?.reviews as typeof rawReviews) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Typography className="text-2xl font-bold">Отзывы обо мне</Typography>
        <Typography className="mt-1 text-sm text-gray-600">
          Здесь отображаются отзывы и оценки от других пользователей
        </Typography>
      </div>

      {/* Статистика рейтинга */}
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl font-bold text-amber-600">
            {(userInfo?.rating ?? 0).toFixed(1)}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(userInfo?.rating ?? 0)
                      ? "fill-current text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              На основе {userInfo?.reviewsCount ?? reviews.length} оценок
            </p>
          </div>
        </div>
      </div>

      {/* Список отзывов */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-xl bg-white p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-sm">
            <MessageSquareQuote className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">Пока нет отзывов</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              Отзывы появятся здесь, когда покупатели или продавцы поделятся впечатлениями о сделках с вами.
            </p>
          </div>
        ) : (
          reviews.map((review, idx) => {
            const reviewerName = review.reviewer?.fullName || (review as any).fullName || "Пользователь";
            const d = review.createdAt ? new Date(review.createdAt) : null;
            const dateStr = d && !isNaN(d.getTime())
              ? d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
              : ((review as any).date || "");

            return (
              <div
                key={review.id ?? `review-${idx}`}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-3 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={review.reviewer?.photo ?? ""}
                      fallback={reviewerName[0] || "П"}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {reviewerName}
                      </p>
                      {dateStr ? (
                        <p className="text-xs text-gray-400">
                          {dateStr}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-current text-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {review.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
