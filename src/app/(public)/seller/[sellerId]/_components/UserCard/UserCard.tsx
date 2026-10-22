"use client";

import type { ProductUser } from "@/api/products";

import { CircleSmallIcon, Flag, MessageSquare, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useStartChatMutation } from "@/api/hooks";
import { Typography } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { useAuth } from "@/lib/contexts";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { ReviewForm } from "@/app/(public)/product/[productId]/_components/review-form";
import { getUserReviews, type Review } from "@/lib/api/requests/reviews";
import { ReportUserDialog } from "@/components/ReportUserDialog";
import { useQuery } from "@tanstack/react-query";

import { PhoneButton } from "./PhoneButton";
import styles from "./UserCard.module.css";

interface UserCardProps {
  user: ProductUser;
  defaultProductId?: number;
}

export const UserCard = ({ user, defaultProductId }: UserCardProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const startChatMutation = useStartChatMutation();
  const [shareLabel, setShareLabel] = useState("Поделиться профилем");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewsListOpen, setIsReviewsListOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ["seller-reviews", user.id],
    queryFn: () => getUserReviews(user.id),
    enabled: isReviewsListOpen,
  });

  const profileType = user.profileType?.toUpperCase();
  const isLegalEntity =
    profileType === "OOO" || profileType === "OOP" || profileType === "IP" || user.profileType === "Юридическое лицо";

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const profileUrl = `${window.location.origin}/seller/${user.id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setShareLabel("Ссылка скопирована");
    } catch {
      setShareLabel("Не удалось скопировать");
    } finally {
      setTimeout(setShareLabel, 1800, "Поделиться профилем");
    }
  };

  const handleWriteSeller = async () => {
    if (!currentUser) {
      const returnUrl = encodeURIComponent(`/seller/${user.id}`);
      router.push(`/auth/sign-in?returnUrl=${returnUrl}`);
      return;
    }
    if (currentUser.id === user.id) {
      toast.error("Нельзя написать самому себе");
      return;
    }
    try {
      const payload =
        defaultProductId != null && defaultProductId > 0
          ? { productId: defaultProductId }
          : { sellerId: user.id };
      const result = await startChatMutation.mutateAsync(payload);
      const chatId = result.chatId || result.id;
      if (!chatId) {
        toast.error("Не удалось создать чат");
        return;
      }
      router.push(`/profile/messages/${chatId}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Войдите в аккаунт, чтобы написать продавцу"));
    }
  };

  const handleOpenReviewDialog = () => {
    if (!currentUser) {
      const returnUrl = encodeURIComponent(`/seller/${user.id}`);
      router.push(`/auth/sign-in?returnUrl=${returnUrl}`);
      return;
    }
    if (currentUser.id === user.id) {
      toast.error("Нельзя оставить отзыв самому себе");
      return;
    }
    setIsReviewOpen(true);
  };

  return (
    <>
      <div className={styles.card}>
        <Link href={`/seller/${user.id}`} className={styles.userHeader}>
          <Avatar size="lg" src={user.photo} fallback={user.fullName?.[0] || "П"} />
          <Typography variant="h2">{user.fullName || "Пользователь"}</Typography>
        </Link>

        <div className={styles.userStats}>
          <button
            type="button"
            onClick={() => setIsReviewsListOpen(true)}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80 text-left"
            title="Посмотреть отзывы"
          >
            <div className={styles.rating}>
              <Typography className={styles.ratingValue}>
                {user.rating?.toFixed(1) || "0.0"}
                <StarIcon fill="currentColor" />
              </Typography>
              <Typography className={`${styles.reviewsCount} underline underline-offset-2`}>
                {user.reviewsCount || 0} отзывов
              </Typography>
            </div>
          </button>
          <span className={styles.profileBadge} data-legal={isLegalEntity}>
            <CircleSmallIcon fill="currentColor" />
            {user.profileType}
          </span>
        </div>

        <div className={styles.userActions}>
          <PhoneButton phoneNumber={user.phoneNumber} />
          <Button disabled={startChatMutation.isPending} type="button" onClick={() => void handleWriteSeller()}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {startChatMutation.isPending ? "Открываем..." : "Написать продавцу"}
          </Button>
          <Button variant="outline" type="button" onClick={handleOpenReviewDialog}>
            <StarIcon className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
            Оставить отзыв
          </Button>
          <Button variant="outline" onClick={handleShare}>
            {shareLabel}
          </Button>
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs py-2 h-auto flex items-center justify-center gap-1.5"
            onClick={() => setIsReportOpen(true)}
          >
            <Flag className="h-3.5 w-3.5" />
            Пожаловаться на пользователя
          </Button>
        </div>
      </div>

      {/* Модальное окно написания отзыва */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Отзыв о продавце {user.fullName}</DialogTitle>
          </DialogHeader>
          <ReviewForm sellerId={user.id} sellerName={user.fullName || "Продавец"} />
        </DialogContent>
      </Dialog>

      {/* Модальное окно просмотра отзывов продавца */}
      <Dialog open={isReviewsListOpen} onOpenChange={setIsReviewsListOpen}>
        <DialogContent className="max-w-lg p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Отзывы о продавце {user.fullName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {reviews.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6">
                У этого продавца пока нет отзывов.
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{rev.reviewer?.fullName || "Покупатель"}</span>
                    <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                      {rev.rating} <StarIcon className="size-3 fill-amber-500" />
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{rev.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог жалобы на пользователя */}
      <ReportUserDialog
        targetUserId={user.id}
        targetUserName={user.fullName}
        productId={defaultProductId}
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
      />
    </>
  );
};
