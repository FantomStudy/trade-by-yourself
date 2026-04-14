import type { ProductUser } from "@/api/products";
import { CircleSmallIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, Button, Typography } from "@/components/ui";
import { toShortName } from "@/lib/format";
import { PhoneButton } from "./PhoneButton";
import styles from "./SellerCard.module.css";

interface SellerCardProps {
  user: ProductUser;
  isOwner?: boolean;
}

export const SellerCard = async ({ user, isOwner = false }: SellerCardProps) => {
  const isLegalEntity = user.profileType === "Юридическое лицо";

  return (
    <div className={styles.card}>
      <Link href={`/seller/${user.id}`} className={styles.userHeader}>
        <Avatar size="lg" src={user.photo} fallback={user.fullName[0]} />
        <Typography variant="h2">{toShortName(user.fullName)}</Typography>
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

      {!isOwner && (
        <div className={styles.userActions}>
          <Button variant="success">Написать продавцу</Button>
          <PhoneButton phoneNumber={user.phoneNumber} />
        </div>
      )}
    </div>
  );
};
