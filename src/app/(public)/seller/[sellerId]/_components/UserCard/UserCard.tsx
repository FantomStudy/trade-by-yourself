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
  const [shareLabel, setShareLabel] = useState("РџРѕРґРµР»РёС‚СЊСЃСЏ РїСЂРѕС„РёР»РµРј");
  const isLegalEntity = user.profileType === "Р®СЂРёРґРёС‡РµСЃРєРѕРµ Р»РёС†Рѕ";

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const profileUrl = `${window.location.origin}/seller/${user.id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setShareLabel("РЎСЃС‹Р»РєР° СЃРєРѕРїРёСЂРѕРІР°РЅР°");
    } catch {
      setShareLabel("РќРµ СѓРґР°Р»РѕСЃСЊ СЃРєРѕРїРёСЂРѕРІР°С‚СЊ");
    } finally {
      setTimeout(setShareLabel, 1800, "РџРѕРґРµР»РёС‚СЊСЃСЏ РїСЂРѕС„РёР»РµРј");
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
          <Typography className={styles.reviewsCount}>{user.reviewsCount || 0} РѕС‚Р·С‹РІРѕРІ</Typography>
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
