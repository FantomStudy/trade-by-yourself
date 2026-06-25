"use client";

import type { ProductUser } from "@/api/products";

import { CircleSmallIcon, MessageSquare, StarIcon } from "lucide-react";
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

  return (
    <div className={styles.card}>
      <Link href={`/seller/${user.id}`} className={styles.userHeader}>
        <Avatar size="lg" src={user.photo} fallback={user.fullName[0]} />
        <Typography variant="h2">{user.fullName}</Typography>
      </Link>

      <div className={styles.userStats}>
        <div className={styles.rating}>
          <Typography className={styles.ratingValue}>
            {user.rating?.toFixed(1) || "0.0"}
            <StarIcon fill="currentColor" />
          </Typography>
          <Typography className={styles.reviewsCount}>{user.reviewsCount || 0} отзывов</Typography>
        </div>
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
        <Button variant="outline" onClick={handleShare}>
          {shareLabel}
        </Button>
      </div>
    </div>
  );
};
