"use client";

import type { ProductUser } from "@/api/products";
import { CircleSmallIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Typography } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

import { PhoneButton } from "./PhoneButton";
import styles from "./UserCard.module.css";

interface UserCardProps {
  user: ProductUser;
}

export const UserCard = ({ user }: UserCardProps) => {
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
        <Button variant="outline" onClick={handleShare}>
          {shareLabel}
        </Button>
      </div>
    </div>
  );
};
