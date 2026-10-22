"use client";

import type { ExtendedProduct } from "@/types";
import { CircleSmall, Flag, MessageSquare, Phone, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useStartChatMutation } from "@/api/hooks";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Typography,
} from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/contexts";
import { getUserReviews } from "@/lib/api/requests/reviews";
import { ReportUserDialog } from "@/components/ReportUserDialog";

import { ReservationForm } from "../reservation-form/reservation-form";
import { ReviewForm } from "../review-form";
import { SecureDealForm } from "../secure-deal-form/secure-deal-form";
import styles from "./seller-card.module.css";

interface SellerCardProps {
  product: ExtendedProduct;
}

export const SellerCard = ({ product }: SellerCardProps) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [showPhone, setShowPhone] = useState(false);
  const [shareLabel, setShareLabel] = useState("Поделиться профилем");
  const [isReviewsListOpen, setIsReviewsListOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const startChatMutation = useStartChatMutation();

  const { data: reviews = [] } = useQuery({
    queryKey: ["seller-reviews", product.seller.id],
    queryFn: () => getUserReviews(product.seller.id),
    enabled: isReviewsListOpen,
  });

  const handleShowPhone = () => {
    setShowPhone((prev) => !prev);
  };

  const handleStartChat = async () => {
    try {
      const result = await startChatMutation.mutateAsync({
        productId: product.id,
      });
      const chatId = result.chatId || result.id;
      if (chatId) {
        router.push(`/profile/messages/${chatId}` as any);
      } else {
        console.error("No chat ID in response:", result);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const handleShareProfile = async () => {
    if (typeof window === "undefined") return;
    const profileUrl = `${window.location.origin}/seller/${product.seller.id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setShareLabel("Ссылка скопирована");
    } catch {
      setShareLabel("Не удалось скопировать");
    } finally {
      setTimeout(setShareLabel, 1800, "Поделиться профилем");
    }
  };

  const handleOpenReviewDialog = () => {
    if (!currentUser) {
      const returnUrl = encodeURIComponent(`/product/${product.id}`);
      router.push(`/auth/sign-in?returnUrl=${returnUrl}`);
      return;
    }
    if (currentUser.id === product.seller.id) {
      toast.error("Нельзя оставить отзыв самому себе");
      return;
    }
    setIsReviewFormOpen(true);
  };

  const profileType = product.seller.profileType?.toUpperCase();
  const isLegalEntity =
    profileType === "OOO" ||
    profileType === "OOP" ||
    profileType === "IP" ||
    product.seller.profileType === "Юридическое лицо";

  return (
    <>
      <div className={styles.card}>
        <Link href={`/seller/${product.seller.id}`} className={styles.userInfo}>
          <Avatar size="lg" src={product.seller.photo} fallback={product.seller.fullName} />
          <Typography variant="h2">{product.seller.fullName}</Typography>
        </Link>

        <div className={styles.stats}>
          <button
            type="button"
            onClick={() => setIsReviewsListOpen(true)}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80 text-left cursor-pointer"
            title="Нажмите, чтобы прочитать отзывы"
          >
            <div className={styles.ratingSection}>
              <Typography className={styles.rating}>
                {product.seller.rating.toFixed(1)}
                <StarIcon fill="currentColor" />
              </Typography>

              <Typography className={`${styles.reviews} underline underline-offset-2 hover:text-blue-600`}>
                {product.seller.reviewsCount} отзывов
              </Typography>
            </div>
          </button>

          <Badge className={styles.profileType} variant={isLegalEntity ? "secondary" : "primary"}>
            <CircleSmall fill="currentColor" />
            {product.seller.profileType}
          </Badge>
        </div>

        <div className={styles.actions}>
          <ReservationForm product={product} />
          <SecureDealForm product={product} />

          <Button disabled={startChatMutation.isPending} variant="success" onClick={handleStartChat}>
            {startChatMutation.isPending ? "Загрузка..." : "Написать продавцу"}
          </Button>

          <Button onClick={handleShowPhone}>
            <Phone className={styles.icon} />
            {showPhone && product.seller.phoneNumber ? product.seller.phoneNumber : "Показать номер"}
          </Button>

          <Button variant="outline" onClick={handleOpenReviewDialog}>
            <StarIcon className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
            Оставить отзыв
          </Button>

          <Button variant="outline" onClick={handleShareProfile}>
            {shareLabel}
          </Button>

          <Button
            variant="ghost"
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs py-2 h-auto flex items-center justify-center gap-1.5"
            onClick={() => setIsReportOpen(true)}
          >
            <Flag className="h-3.5 w-3.5" />
            Пожаловаться на продавца
          </Button>
        </div>
      </div>

      {/* Модальное окно списка отзывов о продавце */}
      <Dialog open={isReviewsListOpen} onOpenChange={setIsReviewsListOpen}>
        <DialogContent className="max-w-lg p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Отзывы о продавце {product.seller.fullName}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{product.seller.rating.toFixed(1)}</span>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.seller.rating) ? "fill-amber-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.seller.reviewsCount} отзывов)</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleOpenReviewDialog}>
              Оставить отзыв
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {reviews.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6">
                У этого продавца пока нет отзывов. Будьте первым!
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

          <div className="pt-3 border-t text-center">
            <Link
              href={`/seller/${product.seller.id}`}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Перейти в профиль продавца →
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно написания отзыва */}
      <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Отзыв о продавце {product.seller.fullName}</DialogTitle>
          </DialogHeader>
          <ReviewForm sellerId={product.seller.id} sellerName={product.seller.fullName} />
        </DialogContent>
      </Dialog>

      {/* Диалог жалобы на продавца */}
      <ReportUserDialog
        targetUserId={product.seller.id}
        targetUserName={product.seller.fullName}
        productId={product.id}
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
      />
    </>
  );
};

